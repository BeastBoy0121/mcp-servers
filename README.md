# mcp-servers

A growing toolkit of personal [Model Context Protocol](https://modelcontextprotocol.io) (MCP) servers, built as npm workspaces so each server stays small and independently runnable while sharing common tooling.

## Servers

| Package | What it does |
| --- | --- |
| [`packages/github-ops`](packages/github-ops) | Tools over your own GitHub account: list repos, list issues/PRs, create an issue, search code |

More servers get added as new folders under `packages/`.

## Developing

```bash
npm install
npm run build -w packages/<server-name>
npm run start -w packages/<server-name>
```

Each server has its own README with setup, auth, and its tool list.
