# Homepage improvement plans

These plans target the current homepage working tree based on commit `09016e3`.
The homepage implementation and assets were uncommitted when the plans were
written, so executors must preserve and include that working-tree state.

| Plan | Title | Severity | Status |
| --- | --- | --- | --- |
| [001](./001-responsive-homepage-images.md) | Deliver responsive homepage images | MEDIUM | DONE |

## Recommended execution order

1. **001 — Deliver responsive homepage images.** It is independent of the motion
   findings and can be executed before or after animation work. If the planned
   hero crop or area-card geometry changes first, reconcile the `sizes` values in
   this plan against the final rendered widths before execution.

## Dependencies

- Plan 001 requires the current uncommitted homepage assets and components to be
  present in the execution worktree.
- Plan 001 uses Astro's existing Sharp image service and adds no dependency.
- Motion findings 1–6 have not yet been converted into plan files.
