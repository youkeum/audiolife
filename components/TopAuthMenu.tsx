"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ClientSafeProvider, getProviders, signIn, signOut, useSession } from "next-auth/react";

export default function TopAuthMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const providerList = useMemo(() => Object.values(providers ?? {}), [providers]);
  const socialProviders = providerList.filter((provider) => provider.id !== "email");
  const supportsEmailMagicLink = providerList.some((provider) => provider.id === "email");

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setInfo(null);
    setError(null);

    const callbackUrl = typeof window === "undefined" ? "/" : window.location.href;
    const result = await signIn("email", {
      email: email.trim(),
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setError("로그인 메일 전송에 실패했습니다.");
      return;
    }

    setInfo("로그인 링크를 이메일로 보냈습니다.");
    setEmail("");
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div className="top-auth-user">
        <span className="top-auth-user-name">{session.user.name ?? session.user.email ?? "회원"}</span>
        {session.user.role === "ADMIN" ? (
          <>
            <a href="/admin/comments">댓글관리</a>
            <a href="/admin/email">이메일관리</a>
          </>
        ) : null}
        <button type="button" onClick={() => signOut({ callbackUrl: window.location.href })}>
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="top-auth-menu">
      <button type="button" className="top-auth-trigger" onClick={() => setOpen(true)}>
        로그인
      </button>

      {open ? (
        <div className="top-auth-modal-backdrop" onClick={() => setOpen(false)}>
          <section className="top-auth-modal" role="dialog" aria-modal="true" aria-label="로그인" onClick={(event) => event.stopPropagation()}>
            <div className="top-auth-modal-head">
              <h3>로그인</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="닫기">
                닫기
              </button>
            </div>

            <div className="top-auth-modal-body">
              {loadingProviders ? <p>로그인 수단 불러오는 중...</p> : null}
              {!loadingProviders && socialProviders.length === 0 && !supportsEmailMagicLink ? (
                <p>로그인 설정이 아직 완료되지 않았습니다.</p>
              ) : null}

              <div className="top-auth-socials">
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
                <form className="top-auth-email-form" onSubmit={handleEmailLogin}>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="이메일 주소"
                    required
                  />
                  <button type="submit">이메일 로그인 링크 받기</button>
                </form>
              ) : null}

              {info ? <p className="member-comments-info">{info}</p> : null}
              {error ? <p className="member-comments-error">{error}</p> : null}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
