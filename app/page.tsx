"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, ArrowRight, ExternalLink } from "lucide-react";

const GITHUB_URL = "https://github.com/EnvTrap/envtrap-package";
const DOCS_URL = "/docs";
const MCP_DOCS_URL = "/docs/mcp-server";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-2 py-1 rounded bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 shrink-0 border border-border text-xs font-mono select-none"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check size={12} className="text-foreground" />
          <span className="text-foreground">Copied</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function CodeBlock({
  filename,
  code,
}: {
  filename?: string;
  code: string;
}) {
  return (
    <div className="border border-border rounded bg-secondary/40 overflow-hidden my-3">
      {filename && (
        <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border bg-secondary/80 text-xs font-mono text-muted-foreground">
          <span>{filename}</span>
          <CopyButton text={code} />
        </div>
      )}
      <div className="relative p-3.5 font-mono text-xs leading-relaxed overflow-x-auto">
        {!filename && (
          <div className="absolute top-2.5 right-2.5">
            <CopyButton text={code} />
          </div>
        )}
        <pre className="text-foreground whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}

export default function Home() {
  const [activePm, setActivePm] = useState<"npm" | "pnpm" | "yarn" | "bun" | "npx">("npm");

  const pmInstallCommands = {
    npm: "npm install -g envtrap",
    pnpm: "pnpm add -g envtrap",
    yarn: "yarn global add envtrap",
    bun: "bun add -g envtrap",
    npx: "# No installation needed",
  };

  const pmRunCommands = {
    npm: "envtrap run node app.js",
    pnpm: "pnpm exec envtrap run node app.js",
    yarn: "yarn envtrap run node app.js",
    bun: "bunx envtrap run bun app.js",
    npx: "npx envtrap run node app.js",
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-foreground selection:text-background">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-16">

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between border-b border-border pb-5">
          <a href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="envtrap logo"
              width={22}
              height={22}
              className="object-contain"
              priority
            />
            <span className="text-base font-mono font-bold tracking-tight text-foreground">
              envtrap
            </span>
          </a>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground font-medium">
            <a href="#channels" className="hover:text-foreground transition-colors">
              Channels
            </a>
            <a href="#quickstart" className="hover:text-foreground transition-colors">
              Quickstart
            </a>
            <a href="#config" className="hover:text-foreground transition-colors">
              Config
            </a>
            <a
              href={DOCS_URL}
              className="text-foreground hover:underline font-semibold"
            >
              Docs
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
        <section className="space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Runtime secret leak prevention for Node.js
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            EnvTrap is an in-process security agent that intercepts and blocks credential exfiltration at the module-loader, network socket, DNS, and subprocess boundaries. It runs directly inside your Node.js process without external network proxies, daemons, or native C++ addons.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#quickstart"
              className="px-4 py-2 bg-foreground text-background text-sm font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Get Started
            </a>
            <a
              href={DOCS_URL}
              className="px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded border border-border hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              Documentation <ArrowRight size={14} />
            </a>
            <a
              href={MCP_DOCS_URL}
              className="px-4 py-2 bg-transparent text-muted-foreground hover:text-foreground text-sm font-medium rounded border border-border hover:bg-secondary transition-colors"
            >
              MCP Server
            </a>
          </div>

          <div className="pt-2">
            <div className="text-xs font-mono text-muted-foreground mb-1">Quick run without installing:</div>
            <div className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border font-mono text-xs text-foreground">
              <span>npx envtrap run node app.js</span>
              <CopyButton text="npx envtrap run node app.js" />
            </div>
          </div>
        </section>

        {/* ── PROBLEM STATEMENT ───────────────────────────────────────────── */}
        <section className="space-y-4 border-t border-border pt-10">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            The Problem: Supply Chain Exfiltration
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Modern Node.js applications rely on hundreds of deeply nested third-party packages. When a dependency is compromised—via typosquatting, account takeover, or malicious updates—it has unrestricted access to <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">process.env</code> and full permission to send credentials over the network.
            </p>
            <p>
              Traditional defenses fail to address this:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground">
              <li>
                <strong>Static scanners (SAST):</strong> Only scan code at rest. They cannot evaluate runtime variables or dynamic obfuscated exfiltration payloads.
              </li>
              <li>
                <strong>Network firewalls:</strong> Cannot inspect outbound HTTPS traffic without provisioning external man-in-the-middle proxies and installing system-level certificates.
              </li>
              <li>
                <strong>Node permission flags:</strong> Coarse-grained and break most npm packages that require legitimate network or disk access.
              </li>
            </ul>
            <p>
              EnvTrap solves this by hooking into Node.js runtime primitives at startup, monitoring exactly what is being sent through each channel before raw bytes leave the process.
            </p>
          </div>
        </section>

        {/* ── THE 5 CHANNELS ──────────────────────────────────────────────── */}
        <section id="channels" className="space-y-6 border-t border-border pt-10">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              The 5 Interception Channels
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              EnvTrap monitors and enforces policy across every physical exit vector in the runtime:
            </p>
          </div>

          <div className="space-y-6 text-sm">
            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">
                1. Network Egress Interception (TLS & Raw Sockets)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Hooks Node&apos;s internal <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">net.Socket</code> and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">tls.TLSSocket</code> constructors. Automatically signs an ephemeral, in-RAM Root CA to parse and scan outgoing request headers and payloads inside process memory before raw ciphertext is transmitted over the wire.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">
                2. DNS Tunneling & Sublabel Auditing
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Intercepts native <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">dns.lookup</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">dns.resolve</code>, and c-ares resolver bindings. Detects base64/hex-encoded credential substrings embedded inside domain sublabels (e.g. <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">c3Ry...evil.org</code>) and drops the query with a synthetic NXDOMAIN.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">
                3. Subprocess Environment Sanitization
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Wraps <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">child_process.spawn</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">exec</code>, and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">fork</code>. Third-party scripts or build tools attempting to shell out to <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">curl</code> or inspect system variables receive an environment stripped of sensitive API keys and tokens.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">
                4. Console & Stderr Log Stream Redaction
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Hooks low-level write descriptors on <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">process.stdout</code> and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">process.stderr</code>. Prevents accidental <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">console.log(process.env)</code> calls or unhandled stack traces from shipping credentials to centralized log services like Datadog, CloudWatch, or Sentry.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">
                5. Dynamic Secret Sync & Worker Threads
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                When environment variables are modified at runtime or fetched from secret stores (e.g. AWS Secrets Manager, Vault), EnvTrap updates its internal baseline and propagates changes across <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">worker_threads</code> using <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">MessageChannel</code> ports without thread locks.
              </p>
            </div>
          </div>
        </section>

        {/* ── QUICKSTART ────────────────────────────────────────────────── */}
        <section id="quickstart" className="space-y-6 border-t border-border pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Quickstart
              </h2>
              <p className="text-sm text-muted-foreground">
                No code modifications required. Works with any Node.js application.
              </p>
            </div>
            {/* Minimal Package Manager Selector */}
            <div className="flex items-center gap-1 border border-border rounded p-0.5 text-xs font-mono">
              {(["npm", "pnpm", "yarn", "bun", "npx"] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setActivePm(pm)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    activePm === pm
                      ? "bg-foreground text-background font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">
                1. Install package ({activePm})
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border font-mono text-xs text-foreground">
                <span>{pmInstallCommands[activePm]}</span>
                <CopyButton text={pmInstallCommands[activePm]} />
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">
                2. Run your application under EnvTrap
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border font-mono text-xs text-foreground">
                <span>{pmRunCommands[activePm]}</span>
                <CopyButton text={pmRunCommands[activePm]} />
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">
                Alternative: Programmatic Node.js register hook
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border font-mono text-xs text-foreground">
                <span>node --import envtrap/register app.js</span>
                <CopyButton text="node --import envtrap/register app.js" />
              </div>
            </div>
          </div>
        </section>

        {/* ── CONFIGURATION ───────────────────────────────────────────────── */}
        <section id="config" className="space-y-4 border-t border-border pt-10">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Configuration (envtrap.json)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              EnvTrap works out of the box with zero configuration. You can optionally add an <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">envtrap.json</code> file to customize channel actions and whitelisted destinations:
            </p>
          </div>

          <CodeBlock
            filename="envtrap.json"
            code={`{
  "$schema": "https://envtrap.dev/schema.json",
  "channels": {
    "network": "block",
    "dns": "block",
    "child_process": "block",
    "stdout": "warn"
  },
  "exclusions": {
    "domains": [
      "api.stripe.com",
      "api.github.com"
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
}`}
          />
        </section>

        {/* ── INCIDENT SCHEMA ─────────────────────────────────────────────── */}
        <section className="space-y-4 border-t border-border pt-10">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Hashed Incident Reports
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              When an exfiltration attempt is blocked, EnvTrap prints a structured incident payload to stderr. To prevent secondary leaks into centralized log collectors (Datadog, CloudWatch), the intercepted secret value is hashed using SHA-256:
            </p>
          </div>

          <CodeBlock
            filename="incident.json (stderr alert)"
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
          />
        </section>

        {/* ── MCP SERVER ──────────────────────────────────────────────────── */}
        <section className="space-y-4 border-t border-border pt-10">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Model Context Protocol (MCP) Integration
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              EnvTrap includes a Model Context Protocol endpoint so AI coding assistants (Cursor, Claude Desktop, Antigravity) can query runtime security status and inspect intercepted alerts:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded border border-border bg-secondary/40 space-y-1.5">
              <div className="text-muted-foreground font-sans text-xs font-medium">Remote MCP Endpoint</div>
              <div className="flex items-center justify-between text-foreground">
                <span className="truncate">https://envtrap.vercel.app/docs/mcp</span>
                <CopyButton text="https://envtrap.vercel.app/docs/mcp" />
              </div>
            </div>
            <div className="p-3 rounded border border-border bg-secondary/40 space-y-1.5">
              <div className="text-muted-foreground font-sans text-xs font-medium">Local Stdio Runner</div>
              <div className="flex items-center justify-between text-foreground">
                <span className="truncate">npx -y envtrap-mcp</span>
                <CopyButton text="npx -y envtrap-mcp" />
              </div>
            </div>
          </div>

          <div className="pt-1">
            <a
              href={MCP_DOCS_URL}
              className="text-xs font-mono text-foreground hover:underline inline-flex items-center gap-1"
            >
              Read MCP documentation <ArrowRight size={12} />
            </a>
          </div>
        </section>

        {/* ── TECHNICAL FAQ ───────────────────────────────────────────────── */}
        <section className="space-y-6 border-t border-border pt-10">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5 text-sm">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">
                How does EnvTrap inspect HTTPS without an external proxy?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                EnvTrap boots before third-party packages. It generates an ephemeral 2048-bit Root CA in memory and attaches hooks to the internal <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">net.Socket</code> and <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">tls.TLSSocket</code> constructors, allowing it to scan request payloads inside V8 heap memory before raw ciphertext is sent.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">
                Does EnvTrap require root/sudo privileges or native compilers?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                No. EnvTrap is pure JavaScript and Node.js built-ins. It requires no elevated OS privileges, no eBPF, and no C++ compilers. It works on local machines, Docker, Kubernetes, AWS ECS/Lambda, and Google Cloud Run.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">
                Can a malicious package bypass EnvTrap by overriding globals?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                EnvTrap executes before any dependencies are imported. It freezes its internal hooks with <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">Object.freeze</code> and caches direct references to native C++ bindings, preventing userland code from tampering with them.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">
                What is the performance overhead?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                In production benchmarks, EnvTrap adds &lt;1.2ms to cold start time, &lt;14MB of heap memory, and &lt;1.8% latency overhead on network socket calls. Ephemeral certificates and lookup tables are stored in memory with zero disk I/O.
              </p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="envtrap" width={16} height={16} className="object-contain" />
            <span>&copy; 2026 EnvTrap. Open source under MIT.</span>
          </div>
          <div className="flex gap-5">
            <a href={DOCS_URL} className="hover:text-foreground transition-colors">
              Docs
            </a>
            <a href={MCP_DOCS_URL} className="hover:text-foreground transition-colors">
              MCP
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
