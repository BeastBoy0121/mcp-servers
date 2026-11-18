import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { octokit, getAuthenticatedUsername } from "./github-client.js";

function textResult(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerTools(server: McpServer): void {
  server.tool(
    "list_repos",
    "List the authenticated user's GitHub repositories (name, visibility, description, last updated).",
    {},
    async () => {
      const { data } = await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: "updated",
      });
      return textResult(
        data.map((repo) => ({
          name: repo.full_name,
          private: repo.private,
          description: repo.description,
          updatedAt: repo.updated_at,
        }))
      );
    }
  );

  server.tool(
    "list_issues",
    "List issues in a repository you own.",
    {
      repo: z.string().describe("Repository name, e.g. 'my-repo' (owned by the authenticated user)"),
      state: z.enum(["open", "closed", "all"]).default("open"),
    },
    async ({ repo, state }) => {
      const owner = await getAuthenticatedUsername();
      const { data } = await octokit.rest.issues.listForRepo({
        owner,
        repo,
        state,
        per_page: 50,
      });
      return textResult(
        data
          .filter((issue) => !issue.pull_request)
          .map((issue) => ({
            number: issue.number,
            title: issue.title,
            state: issue.state,
            url: issue.html_url,
          }))
      );
    }
  );

  server.tool(
    "list_pull_requests",
    "List pull requests in a repository you own.",
    {
      repo: z.string().describe("Repository name, e.g. 'my-repo' (owned by the authenticated user)"),
      state: z.enum(["open", "closed", "all"]).default("open"),
    },
    async ({ repo, state }) => {
      const owner = await getAuthenticatedUsername();
      const { data } = await octokit.rest.pulls.list({
        owner,
        repo,
        state,
        per_page: 50,
      });
      return textResult(
        data.map((pr) => ({
          number: pr.number,
          title: pr.title,
          state: pr.state,
          url: pr.html_url,
        }))
      );
    }
  );

  server.tool(
    "create_issue",
    "Create a new issue in a repository you own.",
    {
      repo: z.string().describe("Repository name, e.g. 'my-repo' (owned by the authenticated user)"),
      title: z.string(),
      body: z.string().optional(),
      labels: z.array(z.string()).optional(),
    },
    async ({ repo, title, body, labels }) => {
      const owner = await getAuthenticatedUsername();
      const { data } = await octokit.rest.issues.create({
        owner,
        repo,
        title,
        body,
        labels,
      });
      return textResult({ number: data.number, url: data.html_url });
    }
  );

  server.tool(
    "search_code",
    "Search code across your own GitHub repositories.",
    {
      query: z.string().describe("Search terms, GitHub code search syntax supported"),
      repo: z.string().optional().describe("Limit the search to one repository you own"),
    },
    async ({ query, repo }) => {
      const owner = await getAuthenticatedUsername();
      const scope = repo ? `repo:${owner}/${repo}` : `user:${owner}`;
      const { data } = await octokit.rest.search.code({
        q: `${query} ${scope}`,
        per_page: 30,
      });
      return textResult(
        data.items.map((item) => ({
          repo: item.repository.full_name,
          path: item.path,
          url: item.html_url,
        }))
      );
    }
  );
}
