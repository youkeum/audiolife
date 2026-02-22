"use client";

import { FormEvent, useState } from "react";

export default function AdminEmailForm() {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [audience, setAudience] = useState<"announcement">("announcement");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          text,
          audience
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "발송 실패");
      }

      setMessage(`발송 완료: 성공 ${data.successCount}건, 실패 ${data.failCount}건`);
      setSubject("");
      setText("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "발송 실패");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-email-form" onSubmit={handleSubmit}>
      <label>
        제목
        <input value={subject} onChange={(event) => setSubject(event.target.value)} minLength={2} maxLength={140} required />
      </label>
      <label>
        본문 (텍스트)
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={12} required />
      </label>
      <label>
        발송 대상
        <select value={audience} onChange={(event) => setAudience(event.target.value as "announcement")}>
          <option value="announcement">전체 공지 수신 회원</option>
        </select>
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "발송 중..." : "동의 회원에게 발송"}
      </button>
      {message ? <p className="admin-email-success">{message}</p> : null}
      {error ? <p className="member-comments-error">{error}</p> : null}
    </form>
  );
}
