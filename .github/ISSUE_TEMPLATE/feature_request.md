name: 🆕 Suggest an improvement or new feature
description: ———
labels: enhancement, under discussion
body:
- type: markdown
  attributes:
  value: |
      👋 Consider contributing by fixing some [easy bugs](https://github.com/refined-prun/refined-prun/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22small%22+label%3Abug).

      🏞️ You can provide screenshots/mockups to better visualize your idea. Files can be dropped in this field
- id: description
  type: textarea
  attributes:
  label: Description
  validations:
  required: true
