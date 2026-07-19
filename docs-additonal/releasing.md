# Releasing

Releases for Cobbler-Web are fully automated with [semantic-release](https://semantic-release.gitbook.io/) — there
is no manual tagging step.

## How it works

Every commit pushed to `main` is analyzed by the `Release` workflow
(`.github/workflows/release.yml`). If the commits since the last release contain at least one `fix`,
`feat`, or breaking change (per [Conventional Commits](https://www.conventionalcommits.org/), which are enforced
on every commit via `commitlint.config.mjs`/`.pre-commit-config.yaml`), semantic-release will:

1. Compute the next version — `fix` → patch, `feat` → minor, a `BREAKING CHANGE:` footer or `!` after the type/scope
   → major.
2. Generate release notes grouped by commit type (Features, Bug Fixes, Performance Improvements, etc. — see
   `.releaserc.json`).
3. Bump the `version` field in `package.json`/`package-lock.json` to match.
4. Commit `package.json` and `package-lock.json` back to `main`, then create and push a `vX.Y.Z` git tag pointing
   at that commit.
5. Create a GitHub Release from the generated notes, and comment on any issues/PRs referenced by the shipped
   commits.

There is no `CHANGELOG.md` file in the repository — the changelog only ever lives in each version's GitHub
Release notes.

The `vX.Y.Z` tag push then triggers the existing `container-build-push.yml` workflow exactly as it does today,
building and pushing a matching versioned image to `ghcr.io/cobbler/cobbler-web` — no changes were needed there.

Nothing is published to npm or GitHub Packages: `@semantic-release/npm` is configured with `npmPublish: false` and
is used purely for its version-bump behavior.

## One-time repository setup

The `Release` workflow needs a token that can push commits/tags in a way that itself triggers other workflows
(the default `GITHUB_TOKEN` deliberately cannot do this, to prevent infinite workflow recursion — see
[GitHub's docs](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow)).
Without this, the release commit/tag would still be created, but `container-build-push.yml` would not fire for it.

A repository admin needs to, once:

1. Create a fine-grained Personal Access Token scoped to only the `cobbler-web` repository, with `Contents:
Read and write`, `Issues: Read and write`, and `Pull requests: Read and write` permissions.
2. Add it as a repository secret named `RELEASE_TOKEN` (Settings → Secrets and variables → Actions).

## Long-term maintenance branches

When a breaking or incompatible change (e.g. dropping support for an old backend version) requires keeping an
older line alive for patch releases, mirror the branch-naming scheme used by
[cobbler-cli](https://github.com/cobbler/cobbler-cli) (its `release/v0/0` branch keeps the pre-v1 line alive):

1. Branch off `main` at the point of divergence, named `release/v{major}/{minor}` (e.g. `release/v1/2`).
2. Add a matching entry to the `branches` array in `.releaserc.json`, e.g.:
   ```json
   { "name": "release/v1/2", "range": "1.2.x" }
   ```
   This tells semantic-release to keep computing and releasing patch versions from that branch independently of
   `main`.
