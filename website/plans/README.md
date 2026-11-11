# Animation plans

Written with the `improve-animations` audit (Emil Kowalski's animation bar),
stamped against commit `8e4a257`.

| #   | Plan                                                  | Severity | Status |
| --- | ----------------------------------------------------- | -------- | ------ |
| 001 | Stop scroll reveal from re-hiding painted content     | HIGH     | DONE   |
| 002 | Give page intros a single entrance                    | MEDIUM   | DONE   |
| 003 | Bring the hero heading blur under 20px                | MEDIUM   | DONE   |
| 004 | Shorten the FAQ answer entrance to UI speed           | MEDIUM   | DONE   |
| 005 | Load and play the hero video only when it can be seen | MEDIUM   | DONE   |

Recommended order: 001, 002 (both touch page-load entrances; 002 is clearer once
001 is in), then 003, 004, 005 independently.

## Missed opportunities (not planned)

- The consent banner disappears instantly on Accept/Refuse; a 160ms
  (`--duration-exit`) opacity fade would soften the moment.
- Header submenu and mobile menu already use exit/enter asymmetry and
  interruptible transitions: no change needed.
