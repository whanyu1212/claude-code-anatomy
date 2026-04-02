# Claude Code Anatomy

How Claude Code actually works, from the decompiled source.

A deep-dive into the internals of [Claude Code](https://code.claude.com) CLI v2.1.88 — Anthropic's AI-powered coding agent. The source was recovered from the npm package's source map (`cli.js.map`), which contains all 4,756 original TypeScript files with full `sourcesContent`.

Key sections compare Claude Code's architecture against Google ADK, OpenAI Agents SDK, LangChain, and LangGraph.

**Live site:** [claude-code-anatomy.pages.dev](https://claude-code-anatomy-sigma.vercel.app)

## What's Covered

- **Agent Loop** — the core while-loop, sub-agent spawning, coordinator/swarm mode, framework comparison
- **Tool System** — tool interface, sources (built-in/MCP/plugins), execution pipeline, parallel/sequential dispatch, framework comparison
- **Task Management** — 7 background task types, lifecycle, persistence, notifications
- **Prompt, Memory & Context** — 7-layer system prompt assembly, CLAUDE.md, auto-memory, dream consolidation, compaction
- **State & Sessions** — Zustand-like immutable store, React contexts, session persistence
- **Extensions** — slash commands, MCP integration, plugins & skills, hooks
- **Security** — permission model, sandbox safety, anti-distillation
- **Runtime** — startup bootstrap, input/rendering, API client, React/Ink components, telemetry

## Credits

Source recovery and build setup based on [Janlaywss/cloud-code](https://github.com/Janlaywss/cloud-code).

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build
npm run build

# Serve production build locally
npm run serve
```

Built with [Docusaurus](https://docusaurus.io/). Deployed on [Vercel](https://vercel.com/).

## License

This is an independent analysis project. Claude Code is a product of [Anthropic](https://www.anthropic.com). All source code references are from the publicly available npm package.
