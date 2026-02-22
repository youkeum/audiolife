import { UserStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  nickname: z.string().trim().min(1).max(32),
  announcementEnabled: z.boolean(),
  replyNotificationEnabled: z.boolean()
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, status: true }
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return NextResponse.json({ message: "설정 조회 권한이 없습니다." }, { status: 403 });
  }

  const subscription = await prisma.emailSubscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      enabled: false,
      announcementEnabled: false,
      replyNotificationEnabled: false
    },
    select: {
      announcementEnabled: true,
      replyNotificationEnabled: true
    }
  });

  return NextResponse.json({
    settings: {
      nickname: user.name ?? "",
      email: user.email,
      ...subscription
    }
  });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, status: true }
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return NextResponse.json({ message: "설정 수정 권한이 없습니다." }, { status: 403 });
  }

  const now = new Date();
  const enabled = parsed.data.announcementEnabled;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.nickname
    }
  });

  const subscription = await prisma.emailSubscription.upsert({
    where: { userId: user.id },
    update: {
      enabled,
      newPostEnabled: false,
      announcementEnabled: parsed.data.announcementEnabled,
      replyNotificationEnabled: parsed.data.replyNotificationEnabled,
      consentAt: enabled ? now : undefined,
      unsubscribedAt: enabled ? null : now
    },
    create: {
      userId: user.id,
      enabled,
      newPostEnabled: false,
      announcementEnabled: parsed.data.announcementEnabled,
      replyNotificationEnabled: parsed.data.replyNotificationEnabled,
      consentAt: enabled ? now : null,
      unsubscribedAt: enabled ? null : now
    },
    select: {
      announcementEnabled: true,
      replyNotificationEnabled: true
    }
  });

  return NextResponse.json({
    settings: {
      nickname: parsed.data.nickname,
      ...subscription
    }
  });
}
