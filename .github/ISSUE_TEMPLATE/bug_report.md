name: 🐛 Report a bug
description: ———
labels: bug
body:
- type: markdown
  attributes:
  value: |
  # Thanks for reporting a bug! ⛰

      Help us replicate the issue by filling in this form. You can use the "Find feature" button in the options page to find which feature is causing the issue.

      Please ensure:

      - The bug is caused by Refined PrUn. It doesn't happen if I disable the extension.

      Include in this issue:

      - Screenshots/video/gif demonstrating the bug, if it’s visual
      - Console errors, if any

- id: description
  type: textarea
  attributes:
  label: Description
  validations:
  required: true
- id: repro
  type: textarea
  attributes:
  label: How to replicate the issue
  validations:
  required: true
- id: version
  type: input
  attributes:
  label: Extension version
  validations:
  required: true
- id: browser
  type: input
  attributes:
  label: Browser(s) used
  validations:
  required: true
