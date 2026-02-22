import { CommentStatus, PostType, UserRole, UserStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

const postTypeSchema = z.enum(["articles", "reviews", "columns"]);

const querySchema = z.object({
  postType: postTypeSchema,
  postSlug: z.string().min(1).max(140)
});

const createCommentSchema = z.object({
  postType: postTypeSchema,
  postSlug: z.string().min(1).max(140),
  body: z.string().trim().min(2).max(500)
});

const deleteCommentSchema = z.object({
  commentId: z.string().min(1)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    postType: searchParams.get("postType"),
    postSlug: searchParams.get("postSlug")
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: {
      postType: parsed.data.postType as PostType,
      postSlug: parsed.data.postSlug,
      status: CommentStatus.VISIBLE
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      body: true,
      createdAt: true,
      editedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });

  return NextResponse.json({ comments });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limiter = consumeRateLimit(`comment:${session.user.id}:${ip}`, 6, 10 * 60 * 1000);

  if (!limiter.allowed) {
    return NextResponse.json(
      { message: "댓글 작성이 너무 빠릅니다. 잠시 후 다시 시도해 주세요." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limiter.retryAfterSec)
        }
      }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = createCommentSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }

  const author = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, status: true, name: true, image: true }
  });

  if (!author || author.status !== UserStatus.ACTIVE) {
    return NextResponse.json({ message: "댓글 권한이 없습니다." }, { status: 403 });
  }

  const comment = await prisma.comment.create({
    data: {
      postType: parsed.data.postType as PostType,
      postSlug: parsed.data.postSlug,
      body: parsed.data.body,
      userId: author.id
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
      editedAt: true
    }
  });

  return NextResponse.json(
    {
      comment: {
        ...comment,
        user: {
          id: author.id,
          name: author.name,
          image: author.image
        }
      }
    },
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = deleteCommentSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, status: true }
  });

  if (!actor || actor.status !== UserStatus.ACTIVE) {
    return NextResponse.json({ message: "삭제 권한이 없습니다." }, { status: 403 });
  }

  const target = await prisma.comment.findUnique({
    where: { id: parsed.data.commentId },
    select: { id: true, userId: true, status: true }
  });

  if (!target || target.status !== CommentStatus.VISIBLE) {
    return NextResponse.json({ message: "댓글을 찾을 수 없습니다." }, { status: 404 });
  }

  const canDelete = actor.role === UserRole.ADMIN || target.userId === actor.id;
  if (!canDelete) {
    return NextResponse.json({ message: "삭제 권한이 없습니다." }, { status: 403 });
  }

  await prisma.comment.update({
    where: { id: target.id },
    data: {
      status: CommentStatus.DELETED,
      body: "",
      deletedAt: new Date()
    }
  });

  return NextResponse.json({ ok: true });
}
