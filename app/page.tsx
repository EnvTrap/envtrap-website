"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

const GITHUB_URL = "https://github.com/EnvTrap/envtrap-package";
const DOCS_URL = "/docs";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-border"
      aria-label="Copy code"
    >
      {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
    </button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/10 selection:text-primary">
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">
        
        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between border-b border-border pb-6">
          <a href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="envtrap" width={24} height={24} className="object-contain" priority />
            <span className="text-lg font-mono font-bold tracking-tight text-foreground">envtrap</span>
          </a>
          <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#threats" className="hover:text-foreground transition-colors">Threats</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">Architecture</a>
            <a href="#quickstart" className="hover:text-foreground transition-colors">Quickstart</a>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Docs</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </nav>
        </header>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
            Runtime secret leak prevention for Node.js.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            EnvTrap is a zero-configuration runtime security agent that intercepts and blocks credential leaks at the module-loader, network socket, and DNS boundaries — running entirely inside your process without external dependencies.
          </p>
          <div className="flex gap-4">
            <a href="#quickstart" className="inline-flex items-center justify-center px-4 py-2.5 bg-foreground text-background text-sm font-bold rounded hover:opacity-90 transition-opacity">
              Get Started
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2.5 bg-transparent text-foreground text-sm font-bold rounded border border-border hover:bg-secondary transition-colors">
              Repository
            </a>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
        <section id="how-it-works" className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-border pb-2 text-foreground">How it works</h2>
          <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
            <p>
              EnvTrap injects itself into the Node.js bootstrap process using hooks. Rather than scanning static code files at rest, EnvTrap monitors your application while it executes, verifying every outgoing channel:
            </p>
            <ul className="space-y-4 list-disc pl-5 text-foreground">
              <li>
                <strong>Network Egress MITM:</strong> Hooks Node's internal network socket creations. For TLS/HTTPS connections, EnvTrap dynamically negotiates encryption via a local, RAM-only Root Certificate Authority, allowing it to scan request payloads inside the process before raw bytes are transmitted over the physical interface.
              </li>
              <li>
                <strong>Subprocess Isolation:</strong> Intercepts binding-layer hooks for subprocess spawns (including <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">child_process</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">exec</code>, and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">spawn</code>) to scrub and filter the inherited environment variables.
              </li>
              <li>
                <strong>DNS Auditing:</strong> Intercepts native resolver query methods. It flags and drops resolution queries containing encoded credential values embedded inside hostname sublabels (DNS tunneling).
              </li>
              <li>
                <strong>Console Redaction:</strong> Hooks process-level writes to <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">stdout</code> and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">stderr</code> to intercept and redact credentials before they reach disk logs or terminal scroll buffers.
              </li>
            </ul>
          </div>
        </section>

        {/* ── THREATS MITIGATED ───────────────────────────────────────────── */}
        <section id="threats" className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-border pb-2 text-foreground">Threats Mitigated</h2>
          <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
            <p>
              Modern software relies on hundreds of deeply nested dependencies. EnvTrap protects your application from the main vectors of credential exfiltration:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-foreground">Supply Chain Attacks</h3>
                <p className="text-base text-muted-foreground">
                  Blocks malicious NPM packages (e.g. compromised updates or typosquatting packages) that try to harvest and send your <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">process.env</code> secrets to command-and-control servers.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-foreground">Silent Telemetry Leaks</h3>
                <p className="text-base text-muted-foreground">
                  Prevents developer-tooling packages from accidentally bundle-transmitting sensitive credential parameters inside diagnostic telemetry headers or analytics payloads.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-foreground">Accidental Print Log leaks</h3>
                <p className="text-base text-muted-foreground">
                  Filters high-entropy credentials from application log streams, ensuring that server crash dumps or debug statements do not store plain text keys in centralized log managers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICKSTART ────────────────────────────────────────────────── */}
        <section id="quickstart" className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-border pb-2 text-foreground">Quickstart</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">1. Install package globally or locally</div>
              <div className="bg-secondary border border-border rounded p-4 font-mono text-sm text-foreground overflow-x-auto flex justify-between items-center gap-4">
                <span>npm install -g envtrap</span>
                <CopyButton text="npm install -g envtrap" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">2. Execute your Node.js application</div>
              <div className="bg-secondary border border-border rounded p-4 font-mono text-sm text-foreground overflow-x-auto flex justify-between items-center gap-4">
                <span>envtrap run node app.js</span>
                <CopyButton text="envtrap run node app.js" />
              </div>
            </div>
          </div>
        </section>

        {/* ── CONFIGURATION ───────────────────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-border pb-2 text-foreground">Configuration</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Create an optional <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">envtrap.json</code> file at your project root to tune bypasses and channel behaviors:
          </p>
          <div className="bg-secondary border border-border rounded-xl overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background text-xs font-mono text-muted-foreground">
              <span>envtrap.json</span>
              <CopyButton text={`{\n  "channels": {\n    "network": "block",\n    "dns": "block",\n    "child_process": "block",\n    "stdout": "warn"\n  },\n  "exclusions": {\n    "domains": ["api.stripe.com"]\n  }\n}`} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-muted-foreground overflow-x-auto select-all">
              <div className="text-foreground">{"{"}</div>
              <div className="pl-4"><span className="text-primary font-semibold">"channels"</span>: {"{"}</div>
              <div className="pl-8"><span className="text-primary font-semibold">"network"</span>: <span className="text-foreground">"block"</span>,       <span className="text-muted-foreground">// block outbound connection</span></div>
              <div className="pl-8"><span className="text-primary font-semibold">"dns"</span>: <span className="text-foreground">"block"</span>,           <span className="text-muted-foreground">// block dns requests</span></div>
              <div className="pl-8"><span className="text-primary font-semibold">"child_process"</span>: <span className="text-foreground">"block"</span>, <span className="text-muted-foreground">// block execution</span></div>
              <div className="pl-8"><span className="text-primary font-semibold">"stdout"</span>: <span className="text-foreground">"warn"</span>            <span className="text-muted-foreground">// warn in logs but redact</span></div>
              <div className="pl-4">{"}"},</div>
              <div className="pl-4"><span className="text-primary font-semibold">"exclusions"</span>: {"{"}</div>
              <div className="pl-8"><span className="text-primary font-semibold">"domains"</span>: [<span className="text-foreground">"api.stripe.com"</span>]  <span className="text-muted-foreground">// ignore this host name</span></div>
              <div className="pl-4">{"}"}</div>
              <div className="text-foreground">{"}"}</div>
            </pre>
          </div>
        </section>

        {/* ── INCIDENT SCHEMA ─────────────────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-border pb-2 text-foreground">Hashed Egress Incidents</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            When a secret leak attempt is blocked, EnvTrap prints a structured JSON incident report to stderr. The exfiltrated secret value is hashed using a non-reversible SHA-256 digest so that logs remain safe for CI pipelines and AI codegen assistants:
          </p>
          <div className="bg-secondary border border-border rounded-xl overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background text-xs font-mono text-muted-foreground">
              <span>incident.json (stderr output)</span>
              <CopyButton text={`{\n  "secretName": "STRIPE_SECRET_KEY",\n  "channel": "network",\n  "sha256": "e4b4ecc7d4a4aea379f1754c7a...",\n  "context": "[REDACTED].attacker.com",\n  "action": "blocked",\n  "timestamp": 1701315024545\n}`} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-muted-foreground overflow-x-auto select-all">
              <div className="text-foreground">{"{"}</div>
              <div className="pl-4"><span className="text-primary font-semibold">"secretName"</span>: <span className="text-foreground">"STRIPE_SECRET_KEY"</span>,</div>
              <div className="pl-4"><span className="text-primary font-semibold">"channel"</span>:    <span className="text-foreground">"network"</span>,</div>
              <div className="pl-4"><span className="text-primary font-semibold">"sha256"</span>:     <span className="text-foreground">"e4b4ecc7d4a4aea379f1754c7a..."</span>,</div>
              <div className="pl-4"><span className="text-primary font-semibold">"context"</span>:    <span className="text-foreground">"[REDACTED].attacker.com"</span>,</div>
              <div className="pl-4"><span className="text-primary font-semibold">"action"</span>:     <span className="text-foreground">"blocked"</span>,</div>
              <div className="pl-4"><span className="text-primary font-semibold">"timestamp"</span>:  <span className="text-foreground">1701315024545</span></div>
              <div className="text-foreground">{"}"}</div>
            </pre>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-border pt-8 flex items-center justify-between text-xs text-muted-foreground font-mono">
          <p>© 2026 EnvTrap. Open source (MIT).</p>
          <div className="flex gap-6">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Docs</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
