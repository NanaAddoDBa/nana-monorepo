# AuthNexus Downstream Mirror

## Source of truth

`NanaAddoDBa/authnexus` is the authoritative AuthNexus repository. The ordinary files under
`apps/authnexus` are a one-way downstream mirror for portfolio organization only. AuthNexus
development, release decisions, product documentation, and standalone validation happen in the
source repository; they must not start from this directory.

## What is mirrored

The initial import uses Git subtree semantics. Every later update is an exact snapshot of a
standalone source commit that has passed the `Validate AuthNexus` workflow's `Frontend` and
`Backend` jobs. `apps/authnexus/.source-revision` records that exact source SHA.

The source repository's `.github/` directory is intentionally excluded. It contains automation
for the source repository and must not be copied into a directory where the monorepo owns the
automation boundary. The only AuthNexus-specific monorepo workflow is
`.github/workflows/sync-authnexus.yml`.

## Update protocol

1. A source `main` commit completes standalone frontend and backend validation.
2. The source workflow dispatches the validated SHA to this repository when its dedicated
   dispatch credential is configured.
3. The target workflow verifies that same SHA against the successful standalone workflow before
   creating a `sync/authnexus` pull request.
4. The workflow archives that one source revision, excludes source `.github/`, updates
   `.source-revision`, and asks the protected `master` branch to merge the pull request.
5. The target never dispatches or pushes changes back to `NanaAddoDBa/authnexus`.

An hourly schedule finds the latest valid green source revision if a dispatch was missed. A manual
workflow run may specify a full source SHA; it is rejected unless the same standalone validation
evidence exists.

## Required credentials

Automatic mirroring remains intentionally inactive until both dedicated repository secrets are
configured. Do not reuse a broad personal token, deployment credential, or source-write token.

| Repository | Secret | Minimum purpose and access |
| --- | --- | --- |
| `NanaAddoDBa/authnexus` | `AUTHNEXUS_MIRROR_TOKEN` | Dispatch `authnexus-updated` to `NanaAddoDBa/nana-monorepo`; access only to that target repository. |
| `NanaAddoDBa/nana-monorepo` | `AUTHNEXUS_MONOREPO_SYNC_TOKEN` | Read/write this monorepo's contents and pull requests so it can push `sync/authnexus`, create/update its pull request, and enable auto-merge. |

Use a fine-grained token or GitHub App installation with only the listed repository access and
permissions. Store only the secret name in workflow definitions; never add a token value to Git,
issues, pull requests, logs, or `.env` files.

## Failure and recovery

The workflow fails rather than marking a source revision as mirrored when its credential is absent,
the requested SHA is not green, the SHA is no longer on source `main`, or the recorded revision is
invalid. The `.source-revision` file changes only in the pull request created from a verified
snapshot.

For recovery, correct the credential or source validation issue, then either wait for the scheduled
run or manually start **Sync AuthNexus mirror** with the exact full green SHA. Review the generated
`sync/authnexus` pull request and its monorepo checks. Do not edit mirrored product files directly;
make the correction in the standalone source and mirror it forward.

## Phase A pipeline boundary

AuthNexus contains both a Next.js frontend and an ASP.NET Core backend. The monorepo's current app
registry supports its own Node.js and Go deployment contracts, so AuthNexus is deliberately not
registered in `apps/*/pipeline.json` during Phase A. Its standalone CI is the authoritative build
and test gate. This avoids misrepresenting an unimplemented monorepo deployment contract as a
working one.
