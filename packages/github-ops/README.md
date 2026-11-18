# github-ops

An MCP server exposing tools over your own GitHub account, built on the [GitHub REST API](https://docs.github.com/en/rest) via [Octokit](https://github.com/octokit/octokit.js).

## Setup

```bash
npm install
npm run build
```

**Auth:** no setup needed if you already have the [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`) — the server reads your token via `gh auth token` automatically. To use a dedicated token instead, copy `.env.example` to `.env` and set `GITHUB_TOKEN` to a [personal access token](https://github.com/settings/tokens).

## Run it

```bash
npm run start
```

This speaks MCP over stdio. Add it to any MCP-capable client (Claude Desktop, Claude Code, the MCP Inspector) by pointing the client at `node dist/index.js` in this folder.

Quick interactive test without any client config:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Tools

| Tool | Description |
| --- | --- |
| `list_repos` | List your repositories (name, visibility, description, last updated) |
| `list_issues(repo, state?)` | List issues in one of your repos |
| `list_pull_requests(repo, state?)` | List pull requests in one of your repos |
| `create_issue(repo, title, body?, labels?)` | Create a new issue |
| `search_code(query, repo?)` | Search code across your repos |

## Next steps

This server uses stdio transport, which works for desktop AI clients but not a browser-based frontend. Wiring it into a web UI will mean adding an HTTP/SSE transport — tracked as a separate, later project.
