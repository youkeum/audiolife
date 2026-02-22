"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ClientSafeProvider, getProviders, signIn, signOut, useSession } from "next-auth/react";

type PostType = "articles" | "reviews" | "columns";

type CommentItem = {
  id: string;
  body: string;
  createdAt: string;
  editedAt: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

type MemberCommentsProps = {
  postType: PostType;
  postSlug: string;
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

export default function MemberComments({ postType, postSlug }: MemberCommentsProps) {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [newBody, setNewBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginInfo, setLoginInfo] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  const [subscriptionSaving, setSubscriptionSaving] = useState(false);

  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    setCommentError(null);

    try {
      const params = new URLSearchParams({ postType, postSlug });
      const response = await fetch(`/api/comments?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "댓글을 불러오지 못했습니다.");
      }

      setComments(data.comments ?? []);
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : "댓글을 불러오지 못했습니다.");
    } finally {
      setLoadingComments(false);
    }
  }, [postType, postSlug]);

  const loadSubscription = useCallback(async () => {
    if (!session?.user?.id) {
      setSubscriptionReady(false);
      return;
    }

    try {
      const response = await fetch("/api/me/subscription", { cache: "no-store" });
      const data = await response.json();

      if (response.ok) {
        setSubscribed(Boolean(data.subscription?.enabled));
      }
    } finally {
      setSubscriptionReady(true);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    let cancelled = false;

    setLoadingProviders(true);
    getProviders()
      .then((result) => {
        if (!cancelled) {
          setProviders(result);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingProviders(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const providerList = useMemo(() => Object.values(providers ?? {}), [providers]);
  const socialProviders = providerList.filter((provider) => provider.id !== "email");
  const supportsEmailMagicLink = providerList.some((provider) => provider.id === "email");

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newBody.trim()) {
      return;
    }

    setSubmitting(true);
    setCommentError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postType,
          postSlug,
          body: newBody
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "댓글 작성에 실패했습니다.");
      }

      setComments((prev) => [...prev, data.comment as CommentItem]);
      setNewBody("");
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : "댓글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!loginEmail.trim()) {
      return;
    }

    setLoginInfo(null);
    setLoginError(null);

    const callbackUrl = typeof window === "undefined" ? "/" : window.location.href;
    const result = await signIn("email", {
      email: loginEmail.trim(),
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setLoginError("로그인 메일 전송에 실패했습니다.");
      return;
    }

    setLoginInfo("로그인 링크를 이메일로 보냈습니다. 메일함을 확인해 주세요.");
    setLoginEmail("");
  }

  function canDeleteComment(comment: CommentItem) {
    if (!session?.user?.id) {
      return false;
    }

    return session.user.role === "ADMIN" || session.user.id === comment.user.id;
  }

  async function handleDeleteComment(commentId: string) {
    const confirmed = window.confirm("이 댓글을 삭제할까요?");
    if (!confirmed) {
      return;
    }

    setDeletingCommentId(commentId);
    setCommentError(null);

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
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : "댓글 삭제에 실패했습니다.");
    } finally {
      setDeletingCommentId(null);
    }
  }

  async function toggleSubscription(enabled: boolean) {
    setSubscriptionSaving(true);

    try {
      const response = await fetch("/api/me/subscription", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled })
      });

      if (!response.ok) {
        throw new Error("설정을 저장하지 못했습니다.");
      }

      setSubscribed(enabled);
    } catch {
      setCommentError("이메일 수신 설정 저장에 실패했습니다.");
    } finally {
      setSubscriptionSaving(false);
    }
  }

  return (
    <div className="member-comments">
      {status === "authenticated" ? (
        <div className="member-comments-authenticated">
          <div className="member-comments-user-row">
            <p>
              <strong>{session.user.name ?? session.user.email ?? "회원"}</strong> 님으로 로그인됨
            </p>
            <button type="button" onClick={() => signOut({ callbackUrl: window.location.href })}>
              로그아웃
            </button>
          </div>

          {subscriptionReady ? (
            <label className="subscription-toggle">
              <input
                type="checkbox"
                checked={subscribed}
                disabled={subscriptionSaving}
                onChange={(event) => toggleSubscription(event.target.checked)}
              />
              새 글/공지 이메일 받기
            </label>
          ) : null}

          <form className="member-comments-form" onSubmit={handleCommentSubmit}>
            <textarea
              value={newBody}
              onChange={(event) => setNewBody(event.target.value)}
              minLength={2}
              maxLength={500}
              placeholder="댓글을 입력해 주세요."
              required
            />
            <div className="member-comments-form-foot">
              <span>{newBody.length}/500</span>
              <button type="submit" disabled={submitting}>
                {submitting ? "등록 중..." : "댓글 등록"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="member-comments-login-box">
          <p>댓글 작성은 회원만 가능합니다.</p>
          <div className="member-comments-login-actions">
            {loadingProviders ? <span>로그인 수단 불러오는 중...</span> : null}
            {!loadingProviders && socialProviders.length === 0 && !supportsEmailMagicLink ? (
              <span>로그인 설정이 아직 완료되지 않았습니다.</span>
            ) : null}
            {socialProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => signIn(provider.id, { callbackUrl: window.location.href })}
              >
                {provider.name} 로그인
              </button>
            ))}
          </div>

          {supportsEmailMagicLink ? (
            <form className="member-comments-email-login" onSubmit={handleEmailLogin}>
              <input
                type="email"
                placeholder="이메일 주소"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                required
              />
              <button type="submit">이메일 로그인 링크 받기</button>
            </form>
          ) : null}

          {loginInfo ? <p className="member-comments-info">{loginInfo}</p> : null}
          {loginError ? <p className="member-comments-error">{loginError}</p> : null}
        </div>
      )}

      <div className="member-comments-list">
        {loadingComments ? <p>댓글 불러오는 중...</p> : null}
        {!loadingComments && comments.length === 0 ? <p>첫 댓글을 남겨보세요.</p> : null}
        {comments.map((comment) => (
          <article key={comment.id} className="member-comment-item">
            <header>
              <strong>{comment.user.name ?? "회원"}</strong>
              <div className="member-comment-item-actions">
                <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
                {canDeleteComment(comment) ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deletingCommentId === comment.id}
                  >
                    {deletingCommentId === comment.id ? "삭제 중..." : "삭제"}
                  </button>
                ) : null}
              </div>
            </header>
            <p>{comment.body}</p>
          </article>
        ))}
      </div>

      {commentError ? <p className="member-comments-error">{commentError}</p> : null}
    </div>
  );
}
