import { UserRole, UserStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

const sendSchema = z
  .object({
    subject: z.string().trim().min(2).max(140),
    html: z.string().max(200000).optional(),
    text: z.string().max(200000).optional(),
    audience: z.enum(["announcement"]).default("announcement")
  })
  .superRefine((value, ctx) => {
    if (!value.html && !value.text) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "html 또는 text 중 하나는 필요합니다.",
        path: ["html"]
      });
    }
  });

function toPreview(html?: string, text?: string) {
  const source = text ?? html?.replace(/<[^>]+>/g, " ") ?? "";
  return source.replace(/\s+/g, " ").trim().slice(0, 180);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, status: true }
  });

  if (!actor || actor.status !== UserStatus.ACTIVE || actor.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limiter = consumeRateLimit(`admin-mail:${actor.id}:${ip}`, 3, 60 * 60 * 1000);

  if (!limiter.allowed) {
    return NextResponse.json(
      { message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limiter.retryAfterSec)
        }
      }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = sendSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;

  if (!resendKey || !resendFrom) {
    return NextResponse.json(
      { message: "메일 설정이 누락되었습니다. RESEND_API_KEY, RESEND_FROM을 확인해 주세요." },
      { status: 503 }
    );
  }

  const subscriptions = await prisma.emailSubscription.findMany({
    where: {
      announcementEnabled: true,
      user: {
        status: UserStatus.ACTIVE,
        email: {
          not: null
        }
      }
    },
    select: {
      user: {
        select: {
          email: true,
          name: true
        }
      }
    }
  });

  const recipients = subscriptions
    .map((row) => row.user.email?.trim())
    .filter((email): email is string => Boolean(email));

  if (recipients.length === 0) {
    return NextResponse.json({ message: "수신 동의한 회원이 없습니다." }, { status: 400 });
  }

  if (recipients.length > 500) {
    return NextResponse.json(
      { message: "한 번에 500명 초과 발송은 제한됩니다. 배치 작업으로 분리해 주세요." },
      { status: 400 }
    );
  }

  const resend = new Resend(resendKey);

  let successCount = 0;
  const failed: string[] = [];

  for (const recipient of recipients) {
    const content =
      parsed.data.html && parsed.data.text
        ? { html: parsed.data.html, text: parsed.data.text }
        : parsed.data.html
          ? { html: parsed.data.html }
          : { text: parsed.data.text as string };

    const { error } = await resend.emails.send({
      from: resendFrom,
      to: recipient,
      subject: parsed.data.subject,
      ...content
    });

    if (error) {
      failed.push(recipient);
    } else {
      successCount += 1;
    }
  }

  await prisma.emailSendLog.create({
    data: {
      subject: parsed.data.subject,
      contentPreview: toPreview(parsed.data.html, parsed.data.text),
      recipientCount: successCount,
      sentByUserId: actor.id
    }
  });

  return NextResponse.json({
    successCount,
    failCount: failed.length,
    failed
  });
}
