import { UserRole, UserStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(300).default(100)
});

const updateSchema = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional()
});

async function getActor() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, status: true }
  });
}

export async function GET(request: Request) {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (actor.status !== UserStatus.ACTIVE || actor.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    limit: searchParams.get("limit") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: parsed.data.limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: { comments: true }
      },
      emailSubscription: {
        select: {
          newPostEnabled: true,
          announcementEnabled: true,
          replyNotificationEnabled: true
        }
      }
    }
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (actor.status !== UserStatus.ACTIVE || actor.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(payload);

  if (!parsed.success || (!parsed.data.role && !parsed.data.status)) {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }

  if (parsed.data.userId === actor.id) {
    return NextResponse.json({ message: "본인 계정 권한/상태는 이 화면에서 변경할 수 없습니다." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true }
  });

  if (!target) {
    return NextResponse.json({ message: "회원을 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: target.id },
    data: {
      role: parsed.data.role,
      status: parsed.data.status
    }
  });

  return NextResponse.json({ ok: true });
}
