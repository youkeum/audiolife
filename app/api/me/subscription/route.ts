import { UserStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  enabled: z.boolean()
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const subscription = await prisma.emailSubscription.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id, enabled: false },
    select: { enabled: true, consentAt: true, unsubscribedAt: true }
  });

  return NextResponse.json({ subscription });
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
    select: { status: true }
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return NextResponse.json({ message: "수정 권한이 없습니다." }, { status: 403 });
  }

  const now = new Date();

  const subscription = await prisma.emailSubscription.upsert({
    where: { userId: session.user.id },
    update: {
      enabled: parsed.data.enabled,
      consentAt: parsed.data.enabled ? now : undefined,
      unsubscribedAt: parsed.data.enabled ? null : now
    },
    create: {
      userId: session.user.id,
      enabled: parsed.data.enabled,
      consentAt: parsed.data.enabled ? now : null,
      unsubscribedAt: parsed.data.enabled ? null : now
    },
    select: { enabled: true, consentAt: true, unsubscribedAt: true }
  });

  return NextResponse.json({ subscription });
}
