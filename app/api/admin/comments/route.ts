import { CommentStatus, UserRole, UserStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(300).default(100),
  scope: z.enum(["visible", "all"]).default("visible")
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, status: true }
  });

  if (!actor || actor.status !== UserStatus.ACTIVE || actor.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    scope: searchParams.get("scope") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: parsed.data.scope === "visible" ? { status: CommentStatus.VISIBLE } : undefined,
    orderBy: { createdAt: "desc" },
    take: parsed.data.limit,
    select: {
      id: true,
      postType: true,
      postSlug: true,
      body: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return NextResponse.json({ comments });
}
