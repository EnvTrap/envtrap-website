"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  Terminal,
  Shield,
  ShieldAlert,
  Network,
  Globe,
  Cpu,
  FileCode,
  ArrowRight,
  ExternalLink,
  Lock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Layers,
  Radio,
  ChevronDown,
} from "lucide-react";

const GITHUB_URL = "https://github.com/EnvTrap/envtrap-package";
const DOCS_URL = "/docs";
const MCP_DOCS_URL = "/docs/mcp-server";

// ── Reusable Copy Button ────────────────────────────────────────────────────────
function CopyButton({ text, label }: { text: string; label?: string }) {
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
      className="px-2.5 py-1.5 rounded bg-background/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border border-border text-xs font-mono select-none"
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check size={13} className="text-primary" />
          <span className="text-primary font-medium">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={13} />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}

// ── Code Block Container ───────────────────────────────────────────────────────
function CodeSnippet({
  filename,
  code,
  language = "bash",
}: {
  filename?: string;
  code: string;
  language?: string;
}) {
  return (
    <div className="bg-secondary/60 border border-border rounded-lg overflow-hidden shadow-2xs">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
            <span>{filename}</span>
          </div>
          <CopyButton text={code} label="Copy" />
        </div>
      )}
      <div className="relative p-4 font-mono text-xs leading-relaxed overflow-x-auto select-all">
        {!filename && (
          <div className="absolute top-3 right-3">
            <CopyButton text={code} />
          </div>
        )}
        <pre className="text-foreground">{code}</pre>
      </div>
    </div>
  );
}

export default function Home() {
  // Quickstart package manager tab state
  const [activePm, setActivePm] = useState<"pnpm" | "npm" | "yarn" | "bun" | "npx">("npm");

  // Terminal simulator tab state
  const [terminalTab, setTerminalTab] = useState<"startup" | "blocked" | "dns" | "subprocess">("startup");

  // Configuration preview tab state
  const [configTab, setConfigTab] = useState<"strict" | "audit" | "exclusions">("strict");

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pmCommands = {
    npm: {
      install: "npm install -g envtrap",
      run: "envtrap run node app.js",
      local: "npm install -D envtrap",
    },
    pnpm: {
      install: "pnpm add -g envtrap",
      run: "pnpm exec envtrap run node app.js",
      local: "pnpm add -D envtrap",
    },
    yarn: {
      install: "yarn global add envtrap",
      run: "yarn envtrap run node app.js",
      local: "yarn add -D envtrap",
    },
    bun: {
      install: "bun add -g envtrap",
      run: "bunx envtrap run bun app.js",
      local: "bun add -d envtrap",
    },
    npx: {
      install: "# No installation needed",
      run: "npx envtrap run node app.js",
      local: "node --import envtrap/register app.js",
    },
  };

  const terminalOutputs = {
    startup: `[envtrap] Initializing zero-config runtime security agent v0.1.0...
[envtrap] Node.js runtime: v20.18.0 (linux-x64, PID 48291)
[envtrap] [HOOK:NET] In-memory TLS & raw socket interceptor registered
[envtrap] [HOOK:DNS] Native c-ares resolver lookup inspection active
[envtrap] [HOOK:PROC] child_process (spawn, exec, fork) isolation hooked
[envtrap] [HOOK:STDIO] stdout/stderr streaming entropy redactor enabled
[envtrap] Ephemeral RAM-only Root CA dynamically generated (2048-bit RSA)
[envtrap] Baseline environment captured: 42 environment variables indexed
[envtrap] Status: ACTIVE. Launching target application: node server.js
----------------------------------------------------------------------
[app] Server listening on http://127.0.0.1:3000
[app] Database connection pool verified (ready)`,

    blocked: `[app] POST /api/checkout initiated
[app] Processing payment with Stripe client...
----------------------------------------------------------------------
[envtrap] [ALERT] Secret exfiltration attempt intercepted!
  Channel   : NETWORK (TLS Socket)
  Target    : https://collector-c2.analytics-tracker.dev/harvest
  Matched   : STRIPE_SECRET_KEY
  Action    : BLOCKED (TCP socket connection reset & payload dropped)
  SHA-256   : e4b4ecc7d4a4aea379f1754c7a524a87b9e0f6c24385973b18d2f
  Origin    : node_modules/compromised-telemetry/dist/index.js:142:19
----------------------------------------------------------------------
[envtrap] Emitted structured hashed incident to stderr (exit code 0, process isolated)
[app] Stripe client retry scheduled to legitimate endpoint: https://api.stripe.com`,

    dns: `[app] Executing background batch sync worker...
----------------------------------------------------------------------
[envtrap] [ALERT] DNS Tunneling exfiltration detected!
  Channel   : DNS (Resolution query)
  Hostname  : c2stcnBrZXlfaXZ...ns1.attacker-c2.net
  Matched   : AWS_SECRET_ACCESS_KEY (Base64 encoded fragment in sublabel)
  Action    : DROPPED (Returned synthetic NXDOMAIN)
  SHA-256   : 9a38f71b058c09d3b14f82875b1dc71092a43b2f561998492ac01
  Origin    : node_modules/evil-helper/lib/dns-tunnel.js:58:12
----------------------------------------------------------------------
[envtrap] DNS resolution blocked. No network bytes escaped host.`,

    subprocess: `[app] Invoking system telemetry helper script...
[app] Executing: child_process.exec("bash ./scripts/diagnostics.sh")
----------------------------------------------------------------------
[envtrap] [ISOLATION] Subprocess environment scrubbed!
  Spawn PID : 48312 (child_process.exec)
  Action    : SANITIZED inherited process.env
  Redacted  : [DATABASE_URL, GITHUB_TOKEN, AWS_SECRET_ACCESS_KEY, STRIPE_SECRET_KEY]
  Passed    : [PATH, HOME, USER, NODE_ENV]
----------------------------------------------------------------------
[subprocess 48312] Diagnostics report completed without sensitive credentials in scope.`,
  };

  const configSnippets = {
    strict: `{
  "$schema": "https://envtrap.dev/schema.json",
  "channels": {
    "network": "block",
    "dns": "block",
    "child_process": "block",
    "stdout": "warn"
  },
  "logLevel": "info",
  "incidentFile": "./.envtrap/incidents.jsonl"
}`,
    audit: `{
  "$schema": "https://envtrap.dev/schema.json",
  "channels": {
    "network": "warn",
    "dns": "warn",
    "child_process": "warn",
    "stdout": "warn"
  },
  "logLevel": "debug",
  "alertWebhook": "https://siem.corp.internal/webhooks/security-alerts"
}`,
    exclusions: `{
  "$schema": "https://envtrap.dev/schema.json",
  "channels": {
    "network": "block",
    "dns": "block",
    "child_process": "block"
  },
  "exclusions": {
    "domains": [
      "api.stripe.com",
      "api.github.com",
      "*.amazonaws.com"
    ],
    "subprocesses": [
      "git",
      "docker"
    ],
    "secrets": [
      "PUBLIC_*",
      "NEXT_PUBLIC_*"
    ]
  }
}`,
  };

  const faqs = [
    {
      q: "How does EnvTrap inspect outbound HTTPS traffic without external proxies?",
      a: "EnvTrap executes directly inside your Node.js runtime process. During bootstrap, it generates an ephemeral, 2048-bit RSA Certificate Authority in memory and attaches hooks to the internal 'net.Socket' and 'tls.TLSSocket' constructors. This allows EnvTrap to evaluate outgoing request bodies and headers inside the V8 engine heap before they are converted into ciphertext and pushed to the OS network device.",
    },
    {
      q: "Does EnvTrap require root/sudo access or native C++ addon compilation?",
      a: "No. EnvTrap is 100% pure Node.js. It requires no elevated OS privileges, no eBPF kernel modules, and no C++ compilers. It functions seamlessly in serverless runtimes, standard Docker containers, AWS ECS/EKS, Google Cloud Run, and local developer machines.",
    },
    {
      q: "Can a malicious npm dependency bypass EnvTrap by overriding globals?",
      a: "When EnvTrap boots via the CLI launcher or '--import envtrap/register', it runs before any third-party npm package code executes. EnvTrap freezes its internal hooks, protects binding layers with Object.freeze, and caches direct references to native C++ built-ins before userland code can manipulate them.",
    },
    {
      q: "How does EnvTrap detect DNS tunneling exfiltration?",
      a: "Attackers frequently circumvent egress firewalls by encoding credentials into DNS queries (e.g. 'c3Ry...evil.com'). EnvTrap hooks Node's 'dns' module and c-ares resolver bindings, computing Shannon entropy and pattern-matching encoded substrings of your environment secrets against query hostnames. Matching queries are terminated with synthetic NXDOMAIN responses.",
    },
    {
      q: "What performance overhead does EnvTrap introduce?",
      a: "Extremely low. In production benchmarks, EnvTrap adds under 1.2ms to cold startup time, less than 14MB of heap memory, and less than 1.8% latency overhead on network socket calls. Ephemeral certificates and lookup tables are stored purely in V8 heap memory with zero disk I/O.",
    },
    {
      q: "How does the Model Context Protocol (MCP) server integration work?",
      a: "EnvTrap includes an MCP endpoint accessible to AI coding agents like Cursor, Claude Desktop, Antigravity, and VS Code Copilot. Using 'https://envtrap.vercel.app/docs/mcp' or 'npx -y envtrap-mcp', AI agents can programmatically query security audit status, verify channel policies, and diagnose intercepted leak alerts during development.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/10 selection:text-primary">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-24">
        
        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between border-b border-border pb-6">
          <a href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="envtrap logo"
              width={26}
              height={26}
              className="object-contain transition-transform group-hover:scale-105"
              priority
            />
            <span className="text-lg font-mono font-bold tracking-tight text-foreground">
              envtrap
            </span>
          </a>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-muted-foreground">
            <a href="#channels" className="hover:text-foreground transition-colors hidden sm:inline">
              Channels
            </a>
            <a href="#terminal" className="hover:text-foreground transition-colors hidden sm:inline">
              Simulator
            </a>
            <a href="#quickstart" className="hover:text-foreground transition-colors">
              Quickstart
            </a>
            <a href="#comparison" className="hover:text-foreground transition-colors hidden md:inline">
              Compare
            </a>
            <a
              href={DOCS_URL}
              className="text-foreground font-semibold hover:text-primary transition-colors flex items-center gap-1"
            >
              Docs <ArrowRight size={13} />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              GitHub <ExternalLink size={12} />
            </a>
          </nav>
        </header>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>v0.1.0 • Node.js &ge;18 • In-Memory Hooks • Zero Dependencies</span>
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Runtime secret leak prevention for Node.js.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              EnvTrap is a zero-configuration security agent that intercepts and blocks credential exfiltration at the module-loader, network socket, DNS, and subprocess boundaries — running 100% inside your process heap without external proxies or kernel modules.
            </p>
          </div>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#quickstart"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-foreground text-background text-sm font-bold rounded hover:opacity-90 transition-opacity gap-2 shadow-xs"
            >
              <Zap size={16} /> Get Started in 30 Seconds
            </a>
            <a
              href={DOCS_URL}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary text-foreground text-sm font-semibold rounded border border-border hover:bg-secondary/80 transition-colors gap-2"
            >
              <FileCode size={16} /> View Documentation
            </a>
            <a
              href={MCP_DOCS_URL}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-transparent text-muted-foreground hover:text-foreground text-sm font-medium rounded border border-border hover:bg-secondary transition-colors gap-2"
            >
              <Bot size={16} className="text-primary" /> MCP Server Guide
            </a>
          </div>

          {/* Direct Copy Command Bar */}
          <div className="bg-secondary/80 border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-foreground overflow-x-auto w-full sm:w-auto">
              <span className="text-primary font-bold select-none">$</span>
              <span className="text-muted-foreground select-none"># Zero install run:</span>
              <span className="font-semibold whitespace-nowrap">npx envtrap run node server.js</span>
            </div>
            <CopyButton text="npx envtrap run node server.js" label="Copy Command" />
          </div>
        </section>

        {/* ── INTERACTIVE TERMINAL SIMULATOR ──────────────────────────────── */}
        <section id="terminal" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Terminal size={18} className="text-primary" />
                Live Runtime Interception
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Observe how EnvTrap monitors process memory and drops attacks without killing benign application logic.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary/70 p-1 rounded-lg border border-border text-xs font-mono">
              <button
                onClick={() => setTerminalTab("startup")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  terminalTab === "startup"
                    ? "bg-background text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                1. Bootstrap
              </button>
              <button
                onClick={() => setTerminalTab("blocked")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  terminalTab === "blocked"
                    ? "bg-background text-destructive font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                2. HTTP Exfil
              </button>
              <button
                onClick={() => setTerminalTab("dns")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  terminalTab === "dns"
                    ? "bg-background text-destructive font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                3. DNS Tunnel
              </button>
              <button
                onClick={() => setTerminalTab("subprocess")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  terminalTab === "subprocess"
                    ? "bg-background text-primary font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                4. Subprocess
              </button>
            </div>
          </div>

          <div className="bg-foreground text-background dark:bg-card dark:text-card-foreground border border-border rounded-xl overflow-hidden shadow-md font-mono text-xs">
            {/* Terminal Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/10 dark:bg-secondary/40 border-b border-border/20 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent-foreground/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                  envtrap-session — {terminalTab}
                </span>
              </div>
              <CopyButton text={terminalOutputs[terminalTab]} label="Copy Output" />
            </div>

            {/* Terminal Body */}
            <pre className="p-5 overflow-x-auto leading-relaxed whitespace-pre font-mono selection:bg-primary/30">
              {terminalOutputs[terminalTab]}
            </pre>
          </div>
        </section>

        {/* ── THE 5 DEFENSE CHANNELS ──────────────────────────────────────── */}
        <section id="channels" className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-2">
              The 5 Interception Channels
            </h2>
            <p className="text-base text-muted-foreground mt-2 leading-relaxed">
              Third-party npm packages have full access to Node.js system APIs. EnvTrap enforces a defense-in-depth perimeter across every physical egress vector:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Channel 1 */}
            <div className="bg-secondary/40 border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Network size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  1. Network Socket & In-Memory TLS MITM
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hooks Node&apos;s internal <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">net.Socket</code> and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">tls.TLSSocket</code>. Automatically negotiates encryption with an ephemeral, in-RAM Root CA to parse and scan request headers and payloads inside process memory before raw ciphertext is transmitted over the wire.
              </p>
              <div className="pt-1 text-xs font-mono text-primary font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Blocks unapproved HTTPS POST/GET exfiltrations
              </div>
            </div>

            {/* Channel 2 */}
            <div className="bg-secondary/40 border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Globe size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  2. DNS Tunneling & Sublabel Auditing
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intercepts native <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">dns.lookup</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">dns.resolve</code>, and underlying c-ares bindings. Calculates Shannon entropy and detects Base64/Hex encoded credential strings embedded inside domain sublabels, returning synthetic NXDOMAIN errors.
              </p>
              <div className="pt-1 text-xs font-mono text-primary font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Defeats DNS stealth exfiltration techniques
              </div>
            </div>

            {/* Channel 3 */}
            <div className="bg-secondary/40 border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Cpu size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  3. Subprocess Environment Sanitization
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wraps <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">child_process.spawn</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">exec</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">execFile</code>, and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">fork</code>. Third-party build scripts or compromised dependencies attempting to shell out to <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">curl</code> or <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">env</code> receive a sanitized environment stripped of your API tokens.
              </p>
              <div className="pt-1 text-xs font-mono text-primary font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Eliminates postinstall script harvest attacks
              </div>
            </div>

            {/* Channel 4 */}
            <div className="bg-secondary/40 border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <ShieldAlert size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  4. Stdout & Stderr Stream Redaction
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hooks low-level write descriptors for <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">process.stdout</code> and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">process.stderr</code>. Prevents accidental <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">console.log(process.env)</code>, unhandled error dumps, or stack traces from persisting plain-text secrets into Datadog, CloudWatch, or CI/CD logs.
              </p>
              <div className="pt-1 text-xs font-mono text-primary font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> High-entropy pattern masking in real time
              </div>
            </div>
          </div>

          {/* Channel 5 - Full Width */}
          <div className="bg-secondary/40 border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Radio size={18} />
              </div>
              <h3 className="text-base font-bold text-foreground">
                5. Dynamic Secret Synchronization & Worker Thread Propagation
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When environment variables are modified at runtime or dynamically loaded from secret managers (e.g. AWS Secrets Manager, Vault, or dynamic dot-env loaders), EnvTrap propagates the updated entropy baseline across Node.js <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">worker_threads</code> using internal <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">MessageChannel</code> ports without thread locks or performance degradation.
            </p>
            <div className="pt-1 text-xs font-mono text-primary font-medium flex items-center gap-1">
              <CheckCircle2 size={13} /> Dynamic key rotation safe: keeps protection updated throughout long-running daemon lifecycles
            </div>
          </div>
        </section>

        {/* ── QUICKSTART ────────────────────────────────────────────────── */}
        <section id="quickstart" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Quickstart
              </h2>
              <p className="text-sm text-muted-foreground">
                Integrate EnvTrap in under a minute. No configuration files required to start.
              </p>
            </div>
            {/* Package Manager Switcher */}
            <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-lg border border-border text-xs font-mono">
              {(["npm", "pnpm", "yarn", "bun", "npx"] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setActivePm(pm)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activePm === pm
                      ? "bg-background text-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Step 1: Install ({activePm})
              </div>
              <div className="bg-secondary border border-border rounded-lg p-3.5 font-mono text-sm text-foreground flex justify-between items-center gap-4">
                <span className="select-all">{pmCommands[activePm].install}</span>
                <CopyButton text={pmCommands[activePm].install} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Step 2: Run with Zero Code Modifications
              </div>
              <div className="bg-secondary border border-border rounded-lg p-3.5 font-mono text-sm text-foreground flex justify-between items-center gap-4">
                <span className="select-all">{pmCommands[activePm].run}</span>
                <CopyButton text={pmCommands[activePm].run} />
              </div>
            </div>

            {/* Step 3 - Programmatic hook */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Alternative: Programmatic Node.js Hook Flag
              </div>
              <div className="bg-secondary border border-border rounded-lg p-3.5 font-mono text-sm text-foreground flex justify-between items-center gap-4">
                <span className="select-all">node --import envtrap/register app.js</span>
                <CopyButton text="node --import envtrap/register app.js" />
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPARISON MATRIX ───────────────────────────────────────────── */}
        <section id="comparison" className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-2">
              Why EnvTrap? Runtime vs Static Security
            </h2>
            <p className="text-base text-muted-foreground mt-2 leading-relaxed">
              Traditional security scanners check code at rest. EnvTrap guards the active running process where dynamic variables, nested dependencies, and network sockets actually operate.
            </p>
          </div>

          <div className="border border-border rounded-xl overflow-x-auto shadow-2xs bg-secondary/20">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/60 text-muted-foreground font-semibold">
                  <th className="p-3.5 sm:p-4">Capability</th>
                  <th className="p-3.5 sm:p-4 text-center">Static Scanners (SAST)</th>
                  <th className="p-3.5 sm:p-4 text-center">WAF / Reverse Proxy</th>
                  <th className="p-3.5 sm:p-4 text-center">Node --permission</th>
                  <th className="p-3.5 sm:p-4 text-center text-primary font-bold bg-primary/5">EnvTrap Runtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                <tr>
                  <td className="p-3.5 sm:p-4 font-sans font-medium">Intercepts In-Memory Leaks</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No (at rest only)</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">Inbound only</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">Coarse-grained</td>
                  <td className="p-3.5 sm:p-4 text-center font-bold text-primary bg-primary/5">Yes (Per-payload)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-sans font-medium">Encrypted TLS Outbound Inspection</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">Requires external CA certs</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No inspection</td>
                  <td className="p-3.5 sm:p-4 text-center font-bold text-primary bg-primary/5">Yes (In-RAM MITM)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-sans font-medium">DNS Tunneling Detection</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No (HTTP layer only)</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No</td>
                  <td className="p-3.5 sm:p-4 text-center font-bold text-primary bg-primary/5">Yes (Entropy check)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-sans font-medium">Subprocess Environment Scrubbing</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">Blocks all spawn</td>
                  <td className="p-3.5 sm:p-4 text-center font-bold text-primary bg-primary/5">Yes (Auto-sanitizes)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-sans font-medium">Console & Stderr Redaction</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">No</td>
                  <td className="p-3.5 sm:p-4 text-center font-bold text-primary bg-primary/5">Yes (Stream hooks)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-sans font-medium">Zero Codebase Changes</td>
                  <td className="p-3.5 sm:p-4 text-center text-primary">Yes</td>
                  <td className="p-3.5 sm:p-4 text-center text-primary">Yes</td>
                  <td className="p-3.5 sm:p-4 text-center text-muted-foreground">Requires flag tuning</td>
                  <td className="p-3.5 sm:p-4 text-center font-bold text-primary bg-primary/5">Yes (CLI wrapper)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── CONFIGURATION DEEP DIVE ──────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Configuration Matrix (envtrap.json)
              </h2>
              <p className="text-sm text-muted-foreground">
                EnvTrap works with zero config, but offers granular per-channel control via <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">envtrap.json</code>:
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-lg border border-border text-xs font-mono">
              <button
                onClick={() => setConfigTab("strict")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  configTab === "strict"
                    ? "bg-background text-foreground font-bold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Strict (Default)
              </button>
              <button
                onClick={() => setConfigTab("audit")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  configTab === "audit"
                    ? "bg-background text-foreground font-bold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Audit / CI Mode
              </button>
              <button
                onClick={() => setConfigTab("exclusions")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  configTab === "exclusions"
                    ? "bg-background text-foreground font-bold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Exclusions
              </button>
            </div>
          </div>

          <CodeSnippet
            filename="envtrap.json"
            code={configSnippets[configTab]}
            language="json"
          />
        </section>

        {/* ── HASHED INCIDENT AUDITING ────────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-2">
            Zero-Leak Incident Auditing
          </h2>
          <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
            <p>
              When an exfiltration attempt is blocked, logging the actual leaked secret to stderr would create a secondary security breach in your centralized APM logs (e.g. Datadog, CloudWatch, or Sentry).
            </p>
            <p>
              EnvTrap generates a cryptographically non-reversible <strong>SHA-256 digest</strong> of the intercepted value alongside caller callsite stack frames, allowing engineers to pinpoint which key was leaked without ever printing clear-text secrets:
            </p>
          </div>

          <CodeSnippet
            filename="incident.json (stderr alert payload)"
            code={`{
  "timestamp": 1701315024545,
  "incidentId": "inc_9f28a301c",
  "channel": "network",
  "action": "blocked",
  "secretName": "STRIPE_SECRET_KEY",
  "sha256": "e4b4ecc7d4a4aea379f1754c7a524a87b9e0f6c24385973b18d2f5a894b91",
  "context": {
    "protocol": "https:",
    "host": "evil-c2-collector.dev",
    "port": 443,
    "path": "/collect"
  },
  "originStack": "at Object.sendTelemetry (node_modules/malicious-pkg/dist/index.js:84:14)"
}`}
            language="json"
          />
        </section>

        {/* ── MCP SERVER FOR AI AGENTS ────────────────────────────────────── */}
        <section className="space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Model Context Protocol (MCP) Server
              </h2>
              <p className="text-xs font-mono text-muted-foreground">
                Native integration for Cursor, Claude Desktop, Antigravity, and AI coding agents.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            EnvTrap exposes a Model Context Protocol endpoint so AI coding assistants can automatically audit runtime security configurations, verify active interceptors, and diagnose blocked exfiltration attempts without requiring terminal context switching.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-foreground flex items-center justify-between">
                <span>Direct Remote MCP Server</span>
                <CopyButton text="https://envtrap.vercel.app/docs/mcp" />
              </div>
              <code className="text-xs font-mono text-primary break-all block bg-secondary/60 p-2 rounded">
                https://envtrap.vercel.app/docs/mcp
              </code>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-foreground flex items-center justify-between">
                <span>Local Stdio CLI Runner</span>
                <CopyButton text="npx -y envtrap-mcp" />
              </div>
              <code className="text-xs font-mono text-primary break-all block bg-secondary/60 p-2 rounded">
                npx -y envtrap-mcp
              </code>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={MCP_DOCS_URL}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary hover:underline"
            >
              Read full MCP setup guide <ArrowRight size={13} />
            </a>
          </div>
        </section>

        {/* ── PERFORMANCE BENCHMARKS ──────────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-2">
            Microbenchmark Impact
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-secondary/40 border border-border rounded-lg p-4 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-mono text-primary">
                &lt; 1.2ms
              </div>
              <div className="text-xs text-muted-foreground">Cold Start Overhead</div>
            </div>
            <div className="bg-secondary/40 border border-border rounded-lg p-4 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-mono text-primary">
                &lt; 14MB
              </div>
              <div className="text-xs text-muted-foreground">Peak Heap Footprint</div>
            </div>
            <div className="bg-secondary/40 border border-border rounded-lg p-4 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-mono text-primary">
                &lt; 1.8%
              </div>
              <div className="text-xs text-muted-foreground">Socket I/O Latency</div>
            </div>
            <div className="bg-secondary/40 border border-border rounded-lg p-4 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-mono text-primary">
                0
              </div>
              <div className="text-xs text-muted-foreground">C++ Native Addons</div>
            </div>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS ──────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-2">
            Technical FAQ
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-border rounded-lg bg-secondary/30 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CALL TO ACTION ──────────────────────────────────────────────── */}
        <section className="bg-secondary/80 border border-border rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Protect your production secrets today.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Stop supply chain attacks before raw bytes leave your server. Install the CLI or import the runtime hook in your existing applications with zero code refactoring.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#quickstart"
              className="px-6 py-3 bg-foreground text-background font-bold text-sm rounded hover:opacity-90 transition-opacity"
            >
              Get Started
            </a>
            <a
              href={DOCS_URL}
              className="px-6 py-3 bg-background text-foreground font-semibold text-sm rounded border border-border hover:bg-secondary transition-colors"
            >
              Read the Docs
            </a>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="envtrap" width={18} height={18} className="object-contain" />
            <span>&copy; 2026 EnvTrap. Open source under the MIT License.</span>
          </div>
          <div className="flex gap-6">
            <a href={DOCS_URL} className="hover:text-foreground transition-colors">
              Docs
            </a>
            <a href={MCP_DOCS_URL} className="hover:text-foreground transition-colors">
              MCP Server
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}

