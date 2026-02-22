"use client";

import { useCallback, useEffect, useState } from "react";

type MemberItem = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BANNED";
  createdAt: string;
  _count: {
    comments: number;
  };
  emailSubscription: {
    announcementEnabled: boolean;
    replyNotificationEnabled: boolean;
  } | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

export default function AdminMembersManager() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [mailFilter, setMailFilter] = useState<"all" | "announcement" | "reply" | "any-on" | "all-off">("all");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/members?limit=200", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "회원 목록을 불러오지 못했습니다.");
      }

      setMembers(data.users ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "회원 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  async function patchMember(userId: string, payload: { role?: "USER" | "ADMIN"; status?: "ACTIVE" | "BANNED" }) {
    setUpdatingId(userId);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...payload
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "회원 변경에 실패했습니다.");
      }

      setMessage("회원 정보를 변경했습니다.");
      await loadMembers();
    } catch (patchError) {
      setError(patchError instanceof Error ? patchError.message : "회원 변경에 실패했습니다.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredMembers = members.filter((member) => {
    const subscription = member.emailSubscription;
    const announcement = Boolean(subscription?.announcementEnabled);
    const reply = Boolean(subscription?.replyNotificationEnabled);

    if (mailFilter === "announcement") return announcement;
    if (mailFilter === "reply") return reply;
    if (mailFilter === "any-on") return announcement || reply;
    if (mailFilter === "all-off") return !announcement && !reply;
    return true;
  });

  return (
    <section className="admin-members-wrap">
      <div className="admin-members-toolbar">
        <label className="admin-members-filter">
          메일 설정 필터
          <select value={mailFilter} onChange={(event) => setMailFilter(event.target.value as typeof mailFilter)}>
            <option value="all">전체</option>
            <option value="any-on">하나 이상 ON</option>
            <option value="all-off">전부 OFF</option>
            <option value="announcement">공지 ON</option>
            <option value="reply">답글알림 ON</option>
          </select>
        </label>
        <button type="button" onClick={loadMembers} disabled={loading}>
          새로고침
        </button>
      </div>

      {loading ? <p>회원 목록 불러오는 중...</p> : null}

      <div className="admin-members-list">
        {filteredMembers.map((member) => (
          <article key={member.id} className="admin-member-item">
            <header>
              <div>
                <strong>{member.name ?? member.email ?? "회원"}</strong>
                <span>{member.email ?? "이메일 없음"}</span>
              </div>
              <small>가입일: {formatDate(member.createdAt)}</small>
            </header>

            <p>
              권한: <b>{member.role}</b> / 상태: <b>{member.status}</b> / 댓글: <b>{member._count.comments}</b>개
            </p>

            <p className="admin-member-subs">
              메일 설정: 공지 {member.emailSubscription?.announcementEnabled ? "ON" : "OFF"} / 답글알림{" "}
              {member.emailSubscription?.replyNotificationEnabled ? "ON" : "OFF"}
            </p>

            <div className="admin-member-actions">
              <button
                type="button"
                onClick={() => patchMember(member.id, { role: member.role === "ADMIN" ? "USER" : "ADMIN" })}
                disabled={updatingId === member.id}
              >
                {member.role === "ADMIN" ? "관리자 해제" : "관리자 지정"}
              </button>
              <button
                type="button"
                onClick={() => patchMember(member.id, { status: member.status === "ACTIVE" ? "BANNED" : "ACTIVE" })}
                disabled={updatingId === member.id}
              >
                {member.status === "ACTIVE" ? "정지" : "정지 해제"}
              </button>
            </div>
          </article>
        ))}
      </div>

      {!loading && filteredMembers.length === 0 ? <p>조건에 맞는 회원이 없습니다.</p> : null}

      {message ? <p className="admin-email-success">{message}</p> : null}
      {error ? <p className="member-comments-error">{error}</p> : null}
    </section>
  );
}
