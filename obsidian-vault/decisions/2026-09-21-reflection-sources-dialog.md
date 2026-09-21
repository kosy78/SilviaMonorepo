# Reflection sources dialog

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Move “Surse” into the result card header, directly below the distribution explanation. Replace the external disclosure with a shadcn/Radix Dialog containing the existing disclaimer and seven source links.

Use the existing Radix dependency, local button component, semantic colors, and Romanian close label. Preserve keyboard focus within the modal, support Escape and the close button, restore focus to the trigger, respect reduced motion, and allow scrolling on short screens. Add the dialog to the internal design-system specimens.

The source links and disclaimer are unchanged. No answers are sent or stored by opening the dialog.
