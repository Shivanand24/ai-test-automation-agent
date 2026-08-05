"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";

// ─── Feature cards data ───────────────────────────────────────────────────────
const features = [
  {
    icon: "⬡",
    title: "GitHub Repo Scanning",
    desc: "Connect any public or private GitHub repository. Our AI scans your routes, components, and API files automatically.",
    color: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.3)",
  },
  {
    icon: "✦",
    title: "AI Test Generation",
    desc: "LLaMA-powered engine reads your codebase and generates comprehensive, meaningful test cases within seconds.",
    color: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.3)",
  },
  {
    icon: "◎",
    title: "Cloud Browser Execution",
    desc: "Tests run in real Browserbase cloud browsers — full Chromium, real network. No local setup required.",
    color: "rgba(9,188,191,0.12)",
    border: "rgba(9,188,191,0.3)",
  },
  {
    icon: "⟳",
    title: "Session Logs & Replays",
    desc: "Capture full test execution logs, session IDs, and video replays. Debug failures in seconds.",
    color: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.25)",
  },
];

// ─── Steps data ───────────────────────────────────────────────────────────────
const steps = [
  { n: "01", title: "Connect Repository", desc: "Link your GitHub account and select the repository you want to test." },
  { n: "02", title: "AI Scans Your Code", desc: "Our AI reads your source files, routes, and API endpoints to understand your app." },
  { n: "03", title: "Generate Test Cases", desc: "LLaMA 3.3-70B generates structured test cases covering critical paths and edge cases." },
  { n: "04", title: "Execute in Cloud", desc: "Tests run on Browserbase cloud browsers. View real-time logs and session replays." },
];

// ─── Pricing ──────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    desc: "For individual developers",
    features: ["1 Repository", "25 Test Cases/month", "Cloud Execution", "Basic Logs"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For growing teams",
    features: ["Unlimited Repositories", "500 Test Cases/month", "Browserbase Cloud", "Session Video Replays", "Priority Support"],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large organizations",
    features: ["Unlimited everything", "GitHub PR Bot", "Self-healing Tests", "Dedicated Support", "SLA & Security"],
    cta: "Contact Sales",
    popular: false,
  },
];

// ─── Code snippet lines ───────────────────────────────────────────────────────
const codeLines = [
  { cls: "cl-gray",   text: "// AI-Generated Test · Dashboard Load" },
  { cls: "cl-violet", text: "test(" },
  { cls: "cl-yellow", text: '  "Dashboard renders for authenticated user",' },
  { cls: "cl-violet", text: "  async ({ page }) => {" },
  { cls: "cl-blue",   text: "    await page.goto(" },
  { cls: "cl-green",  text: '      "https://app.yourdomain.com"' },
  { cls: "cl-blue",   text: "    );" },
  { cls: "cl-blue",   text: "    await page.waitForSelector(" },
  { cls: "cl-green",  text: '      "[data-testid=dashboard]"' },
  { cls: "cl-blue",   text: "    );" },
  { cls: "cl-orange", text: "    expect(await page.title()).toBe(" },
  { cls: "cl-green",  text: '      "Workspace · TestAgent"' },
  { cls: "cl-orange", text: "    );" },
  { cls: "cl-violet", text: "  }" },
  { cls: "cl-violet", text: ");" },
];

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Redirect signed-in users directly to workspace
  const handleConnect = () => {
    if (isSignedIn) {
      router.push("/workspace");
    }
    // If not signed in, the SignInButton wrapper handles it
  };

  return (
    <div className="lp-root" style={{ position: "relative" }}>

      {/* ── Background Glow Orbs ─────────────────────────────────── */}
      <div className="glow-orb" style={{ width: 600, height: 600, background: "#6366f1", top: -200, left: -200 }} />
      <div className="glow-orb" style={{ width: 500, height: 500, background: "#8b5cf6", top: 100, right: -150 }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: "#09bcbf", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║                     NAVIGATION                           ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(9,9,11,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 2rem",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo.svg" alt="TestAgent" width={32} height={28} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#fafafa", letterSpacing: "-0.01em" }}>
              Test<span style={{ color: "#6366f1" }}>Agent</span>
            </span>
          </div>

          {/* Nav links – desktop */}
          <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }}
            className="hide-mobile">
            {["Features", "How it Works", "Pricing"].map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="nav-link">{l}</a>
              </li>
            ))}
          </ul>

          {/* Auth CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isSignedIn ? (
              <a href="/workspace" className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>
                Go to Workspace →
              </a>
            ) : (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/workspace">
                  <button className="btn-ghost" style={{ padding: "8px 18px", fontSize: 14 }}>Sign In</button>
                </SignInButton>
                <SignInButton mode="modal" forceRedirectUrl="/workspace">
                  <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>
                    Connect App →
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║                     HERO SECTION                         ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}
      <section ref={heroRef} style={{
        minHeight: "92vh", display: "flex", alignItems: "center",
        padding: "80px 2rem 60px",
        position: "relative",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

          {/* Left – copy */}
          <div className="fade-in-up">
            <div className="badge-pill" style={{ marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              Powered by AI + Browserbase
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 20px", letterSpacing: "-0.03em", color: "#fafafa" }}>
              AI that <span className="gradient-text">tests your code</span>{" "}
              automatically
            </h1>

            <p style={{ fontSize: 18, color: "#a1a1aa", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 480 }}>
              Connect your GitHub repository. Our AI scans your codebase,
              generates comprehensive test cases, and executes them in real
              cloud browsers — completely automated.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {isSignedIn ? (
                <a href="/workspace" className="btn-primary">
                  Go to Workspace →
                </a>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl="/workspace">
                  <button className="btn-primary">
                    Connect GitHub →
                  </button>
                </SignInButton>
              )}
              <a href="#how-it-works" className="btn-ghost">Watch how it works</a>
            </div>

            <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
              {["No credit card required", "Works with any stack", "Browserbase included"].map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: "#71717a", fontSize: 13 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right – 3D floating code card */}
          <div className="card-3d-wrapper" style={{ position: "relative" }}>
            <div className="card-float glass-card gradient-border" style={{ width: "100%", maxWidth: 420, padding: 0, overflow: "hidden" }}>
              {/* Card header */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#ef4444","#fbbf24","#4ade80"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: "#52525b", marginLeft: 8, fontFamily: "monospace" }}>
                  tests/dashboard.spec.ts
                </span>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 999, background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }}>
                    ✓ Passed
                  </span>
                </div>
              </div>

              {/* Code */}
              <div className="code-block" style={{ borderRadius: 0, border: "none" }}>
                {codeLines.map((l, i) => (
                  <div key={i} className={l.cls} style={{ marginBottom: 1 }}>{l.text}</div>
                ))}
              </div>

              {/* Status footer */}
              <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 12, color: "#71717a" }}>Tests: <span style={{ color: "#fafafa" }}>12</span></span>
                  <span style={{ fontSize: 12, color: "#71717a" }}>Passed: <span style={{ color: "#4ade80" }}>11</span></span>
                  <span style={{ fontSize: 12, color: "#71717a" }}>Failed: <span style={{ color: "#ef4444" }}>1</span></span>
                </div>
                <span style={{ fontSize: 12, color: "#71717a" }}>1.2s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║               HOW IT FLOWS — PIPELINE                    ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}
      <section style={{ padding: "80px 2rem 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>

          {/* Capabilities badge + headline */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ display: "inline-block", padding: "5px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", color: "#71717a", fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
              Capabilities
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fafafa", margin: "0 0 16px", lineHeight: 1.1 }}>
              Everything in one <span className="gradient-text">pipeline</span>
            </h2>
            <p style={{ color: "#71717a", fontSize: 17, maxWidth: 460, margin: "0 auto 52px", lineHeight: 1.65 }}>
              From your first commit to a passing test suite — no DevOps, no config, no brittle scripts.
            </p>
          </div>

          {/* Label */}
          <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "#52525b", fontWeight: 600, textTransform: "uppercase", marginBottom: 52 }}>
            HOW IT FLOWS
          </p>


          {/* Pipeline Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 8 }}>
            {[
              { icon: "⬡", label: "GitHub Repo",     sub: "Connect & clone",    color: "#6366f1", bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.4)" },
              { icon: "✦", label: "AI Analysis",     sub: "Map routes + flows", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)" },
              { icon: "⚙", label: "Test Generation", sub: "214 scenarios",       color: "#09bcbf", bg: "rgba(9,188,191,0.12)",  border: "rgba(9,188,191,0.4)"  },
              { icon: "☁", label: "Browserbase",     sub: "Cloud execution",    color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.4)" },
              { icon: "✓", label: "Results",          sub: "Report + video",     color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.4)" },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                {/* Node */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  {/* Icon circle */}
                  <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: step.bg,
                    border: `1.5px solid ${step.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, color: step.color,
                    boxShadow: `0 0 24px ${step.bg}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "default",
                  }}
                    onMouseOver={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${step.border}`;
                    }}
                    onMouseOut={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${step.bg}`;
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Label */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e4e4e7", marginBottom: 2 }}>{step.label}</div>
                    <div style={{ fontSize: 11, color: "#52525b" }}>{step.sub}</div>
                  </div>
                </div>

                {/* Animated connector arrow */}
                {i < arr.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 8px", marginBottom: 28, flexShrink: 0 }}>
                    <div style={{ position: "relative", width: 72, height: 2 }}>
                      {/* Track */}
                      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.07)", borderRadius: 2 }} />
                      {/* Animated fill */}
                      <div style={{
                        position: "absolute", top: 0, left: 0, height: "100%",
                        background: `linear-gradient(90deg, ${arr[i].color}, ${arr[i+1].color})`,
                        borderRadius: 2,
                        animation: `pipelineFlow 2s ease-in-out ${i * 0.3}s infinite alternate`,
                      }} />
                    </div>
                    {/* Arrow head */}
                    <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `6px solid ${arr[i+1].color}`, opacity: 0.7 }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║              TRUSTED BY — SCROLLING MARQUEE              ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}
      <section style={{ padding: "64px 0 0", overflow: "hidden" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "#3f3f46", fontWeight: 600, textTransform: "uppercase", textAlign: "center", marginBottom: 28 }}>
          TRUSTED BY TEAMS BUILDING ON
        </p>

        {/* Marquee track */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Fade edges */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(90deg, #09090b, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(-90deg, #09090b, transparent)", zIndex: 2, pointerEvents: "none" }} />

          <div style={{ display: "flex", animation: "marqueeScroll 28s linear infinite", width: "max-content" }}>
            {[...Array(2)].map((_, dupeIdx) => (
              <div key={dupeIdx} style={{ display: "flex", alignItems: "center", gap: 56, padding: "0 28px" }}>
                {["Next.js", "Vercel", "React", "Groq", "Browserbase", "Neon", "Clerk", "Playwright", "GitHub", "TypeScript", "Drizzle", "Tailwind"].map(brand => (
                  <span key={brand} style={{ fontSize: 15, fontWeight: 600, color: "#3f3f46", letterSpacing: "-0.01em", whiteSpace: "nowrap", transition: "color 0.2s", cursor: "default" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#a1a1aa")}
                    onMouseOut={e => (e.currentTarget.style.color = "#3f3f46")}>
                    {brand}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline & marquee keyframes */}
      <style>{`
        @keyframes pipelineFlow {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <hr className="lp-divider" style={{ marginTop: 64 }} />

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║                  FEATURES SECTION                        ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}

      <section id="features" style={{ padding: "100px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge-pill" style={{ marginBottom: 16, display: "inline-flex" }}>Features</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", color: "#fafafa" }}>
              Everything you need to ship{" "}
              <span className="gradient-text">better software</span>
            </h2>
            <p style={{ color: "#71717a", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>
              From repository connection to cloud browser execution — fully automated, zero configuration.
            </p>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="glass-card gradient-border" style={{ padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.color, border: `1px solid ${f.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 10px", color: "#fafafa" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║                HOW IT WORKS SECTION                      ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}
      <section id="how-it-works" style={{ padding: "100px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge-pill" style={{ marginBottom: 16, display: "inline-flex" }}>How it Works</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", color: "#fafafa" }}>
              From code to{" "}
              <span className="gradient-text">confidence in 4 steps</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ position: "relative" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: 19, left: "calc(38px + 1rem)", right: "-1rem", height: 1, background: "linear-gradient(90deg, rgba(99,102,241,0.4), rgba(255,255,255,0.04))", zIndex: 0 }} className="hide-mobile" />
                )}

                <div className="glass-card" style={{ padding: 24, position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div className="step-number">{s.n}</div>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fafafa", margin: "0 0 8px" }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║                   PRICING SECTION                        ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}
      <section id="pricing" style={{ padding: "100px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge-pill" style={{ marginBottom: 16, display: "inline-flex" }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", color: "#fafafa" }}>
              Simple, transparent <span className="gradient-text">pricing</span>
            </h2>
            <p style={{ color: "#71717a", fontSize: 17, maxWidth: 400, margin: "0 auto" }}>
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {plans.map((plan) => (
              <div key={plan.name} className={`glass-card${plan.popular ? " pricing-popular" : ""}`} style={{ padding: 32 }}>
                {plan.popular && (
                  <div style={{ position: "absolute", top: 16, right: 16 }}>
                    <span className="badge-pill" style={{ fontSize: 11, padding: "3px 10px" }}>Most Popular</span>
                  </div>
                )}
                <p style={{ fontSize: 14, color: "#71717a", margin: "0 0 8px" }}>{plan.desc}</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fafafa", margin: "0 0 4px" }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "0 0 24px" }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: "#fafafa" }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: "#71717a" }}>{plan.period}</span>
                </div>

                <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#a1a1aa" }}>
                      <span style={{ color: "#4ade80", fontSize: 13 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                {isSignedIn ? (
                  <a href="/workspace" className={plan.popular ? "btn-primary" : "btn-ghost"} style={{ width: "100%", justifyContent: "center" }}>
                    {plan.cta}
                  </a>
                ) : (
                  <SignInButton mode="modal" forceRedirectUrl="/workspace">
                    <button className={plan.popular ? "btn-primary" : "btn-ghost"} style={{ width: "100%", justifyContent: "center" }}>
                      {plan.cta}
                    </button>
                  </SignInButton>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║                      CTA BANNER                          ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}
      <section style={{ padding: "80px 2rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="glass-card" style={{ padding: "56px 40px", background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.25)" }}>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fafafa", margin: "0 0 16px" }}>
              Ready to automate your <span className="gradient-text">testing?</span>
            </h2>
            <p style={{ color: "#71717a", fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
              Join developers who ship with confidence. Connect your GitHub repository and start generating tests in under 60 seconds.
            </p>
            {isSignedIn ? (
              <a href="/workspace" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                Open Workspace →
              </a>
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/workspace">
                <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                  Get Started Free →
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗ */}
      {/* ║                       FOOTER                             ║ */}
      {/* ╚═══════════════════════════════════════════════════════════╝ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo.svg" alt="TestAgent" width={24} height={20} />
            <span style={{ fontWeight: 700, fontSize: 14, color: "#fafafa" }}>
              Test<span style={{ color: "#6366f1" }}>Agent</span>
            </span>
            <span style={{ color: "#3f3f46", fontSize: 14, marginLeft: 8 }}>© 2025</span>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            {["Features", "Pricing", "How it Works"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{ color: "#52525b", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                onMouseOver={e => (e.currentTarget.style.color = "#a1a1aa")}
                onMouseOut={e => (e.currentTarget.style.color = "#52525b")}>
                {l}
              </a>
            ))}
          </div>

          <div style={{ fontSize: 12, color: "#3f3f46" }}>
            Built with Next.js · Groq · Browserbase
          </div>
        </div>
      </footer>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
