import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyScheduler Privacy Policy",
  robots: {
    index: false,
    follow: false
  }
};

export default function MsPolicyPage() {
  return (
    <section className="private-policy-screen">
      <p className="private-policy-brand">MyScheduler</p>
      <h1>Privacy policy</h1>
      <p>We do not collect any personal data or information from our users.</p>
    </section>
  );
}
