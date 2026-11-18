import { execFileSync } from "node:child_process";
import { Octokit } from "octokit";

function resolveToken(): string {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  try {
    return execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();
  } catch {
    throw new Error(
      "No GitHub token found. Set GITHUB_TOKEN in .env, or run `gh auth login` so `gh auth token` can supply one."
    );
  }
}

export const octokit = new Octokit({ auth: resolveToken() });

export async function getAuthenticatedUsername(): Promise<string> {
  const { data } = await octokit.rest.users.getAuthenticated();
  return data.login;
}
