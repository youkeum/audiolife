"use client";

import { useCallback, useEffect, useState } from "react";

type Scope = "visible" | "all";

type AdminCommentItem = {
  id: string;
  postType: "articles" | "reviews" | "columns";
  postSlug: string;
  body: string;
  status: "VISIBLE" | "HIDDEN" | "DELETED";
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getPostHref(postType: AdminCommentItem["postType"], postSlug: string) {
  return `/${postType}/${postSlug}`;
}

export default function AdminCommentsManager() {
  const [scope, setScope] = useState<Scope>("visible");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [comments, setComments] = useState<AdminCommentItem[]>([]);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const params = new URLSearchParams({ limit: "200", scope });
      const response = await fetch(`/api/admin/comments?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "댓글 목록을 불러오지 못했습니다.");
      }

      setComments(data.comments ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "댓글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function handleDelete(commentId: string) {
    const confirmed = window.confirm("이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    setDeletingId(commentId);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "댓글 삭제에 실패했습니다.");
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setMessage("댓글을 삭제했습니다.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "댓글 삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-comments-wrap">
      <div className="admin-comments-toolbar">
        <label>
          보기
          <select value={scope} onChange={(event) => setScope(event.target.value as Scope)}>
            <option value="visible">노출 댓글만</option>
            <option value="all">전체 상태</option>
          </select>
        </label>
        <button type="button" onClick={loadComments} disabled={loading}>
          새로고침
        </button>
      </div>

      {loading ? <p>댓글 목록 불러오는 중...</p> : null}
      {!loading && comments.length === 0 ? <p>관리할 댓글이 없습니다.</p> : null}

      <div className="admin-comments-list">
        {comments.map((comment) => (
          <article key={comment.id} className="admin-comment-item">
            <header>
              <div>
                <strong>{comment.user.name ?? comment.user.email ?? "회원"}</strong>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
              <div className="admin-comment-actions">
                <a href={getPostHref(comment.postType, comment.postSlug)} target="_blank" rel="noreferrer">
                  원문 보기
                </a>
                {comment.status === "VISIBLE" ? (
                  <button type="button" onClick={() => handleDelete(comment.id)} disabled={deletingId === comment.id}>
                    {deletingId === comment.id ? "삭제 중..." : "삭제"}
                  </button>
                ) : (
                  <span>{comment.status}</span>
                )}
              </div>
            </header>
            <p>{comment.body || "(삭제된 댓글)"}</p>
            <small>
              {comment.postType}/{comment.postSlug}
            </small>
          </article>
        ))}
      </div>

      {message ? <p className="admin-email-success">{message}</p> : null}
      {error ? <p className="member-comments-error">{error}</p> : null}
    </section>
  );
}
