"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type SettingsState = {
  nickname: string;
  email: string;
  announcementEnabled: boolean;
  replyNotificationEnabled: boolean;
};

export default function UserSettingsForm() {
  const { update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    nickname: "",
    email: "",
    announcementEnabled: false,
    replyNotificationEnabled: false
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/me/settings", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "설정을 불러오지 못했습니다.");
        }

        if (!cancelled) {
          setSettings({
            nickname: data.settings?.nickname ?? "",
            email: data.settings?.email ?? "",
            announcementEnabled: Boolean(data.settings?.announcementEnabled),
            replyNotificationEnabled: Boolean(data.settings?.replyNotificationEnabled)
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "설정을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/me/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: settings.nickname,
          announcementEnabled: settings.announcementEnabled,
          replyNotificationEnabled: settings.replyNotificationEnabled
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "설정 저장에 실패했습니다.");
      }

      await update({ name: settings.nickname });
      setMessage("설정을 저장했습니다.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "설정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>설정 불러오는 중...</p>;
  }

  return (
    <form className="user-settings-form" onSubmit={onSubmit}>
      <label>
        로그인 이메일
        <input value={settings.email} disabled />
      </label>
      <label>
        닉네임
        <input
          value={settings.nickname}
          onChange={(event) => setSettings((prev) => ({ ...prev, nickname: event.target.value }))}
          minLength={1}
          maxLength={32}
          required
        />
      </label>

      <label className="user-settings-check">
        <input
          type="checkbox"
          checked={settings.announcementEnabled}
          onChange={(event) => setSettings((prev) => ({ ...prev, announcementEnabled: event.target.checked }))}
        />
        전체 공지 이메일 받기
      </label>

      <label className="user-settings-check">
        <input
          type="checkbox"
          checked={settings.replyNotificationEnabled}
          onChange={(event) => setSettings((prev) => ({ ...prev, replyNotificationEnabled: event.target.checked }))}
        />
        내가 단 댓글에 답글이 달리면 이메일 알림 받기
      </label>

      <button type="submit" disabled={saving}>
        {saving ? "저장 중..." : "설정 저장"}
      </button>

      {message ? <p className="admin-email-success">{message}</p> : null}
      {error ? <p className="member-comments-error">{error}</p> : null}
    </form>
  );
}
