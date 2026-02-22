import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserSettingsForm from "@/components/UserSettingsForm";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "설정"
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  return (
    <section className="page-stack">
      <div className="meta">MY SETTINGS</div>
      <h1 className="page-title">계정 설정</h1>
      <p className="description">닉네임과 이메일 알림 설정을 관리합니다.</p>
      <UserSettingsForm />
    </section>
  );
}
