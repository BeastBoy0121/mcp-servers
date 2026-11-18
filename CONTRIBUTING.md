# Workflow

Solo-maintained, but run with PR discipline rather than direct pushes to `master`.

## Branching

1. Create a short-lived branch off `master`: `feat/<thing>`, `fix/<thing>`, or `chore/<thing>`.
2. Commit with a conventional-commit-style prefix (`feat:`, `fix:`, `chore:`, `docs:`).
3. Push the branch and open a PR into `master`.
4. Let CI (`.github/workflows/ci.yml`) finish — it builds every workspace package.
5. Self-review the diff, then squash-merge. Delete the branch after merge.

## Versioning

This is an npm-workspaces monorepo; each package under `packages/*` is versioned independently with [Changesets](https://github.com/changesets/changesets).

- If a PR changes a package's behavior (new tool, bug fix, breaking change), run `npx changeset` before opening the PR and answer its prompts (which package, patch/minor/major, a one-line summary). Commit the generated `.changeset/*.md` file with the PR.
- Skip the changeset for docs-only or CI-only changes.
- Periodically (not every PR): run `npx changeset version` on `master`, which bumps package versions and writes `CHANGELOG.md` entries from the accumulated changesets. Commit that, tag it (`git tag packages/<name>@X.Y.Z` or a repo-wide `vX.Y.Z` for a milestone), push the tag, and `gh release create` for the ones worth calling out.

No `npm publish` step — these packages are private/local (`"private": true`), run by pointing an MCP client at `dist/index.js` directly, not installed from a registry.

## Adding a new MCP server

1. `packages/<name>/` with its own `package.json` (`"private": true`), `tsconfig.json` extending `../../tsconfig.base.json`, `src/`, and a README describing setup/auth/tools.
2. Register it in the root `README.md` table.
3. Same branch -> PR -> CI -> merge flow as any other change.
