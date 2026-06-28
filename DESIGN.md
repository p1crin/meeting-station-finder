---
name: Heritage
description: Architectural Minimalism meets Journalistic Gravitas — the visual identity for the Meeting Station Finder.
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  tertiary-hover: "#9E3826"
  tertiary-container: "#F0E0DB"
  neutral: "#F7F5F2"
  neutral-dim: "#EEEAE4"
  outline: "#E2DDD5"
  on-tertiary: "#F7F5F2"
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 3rem
    fontWeight: 700
    letterSpacing: -0.02em
  h2:
    fontFamily: Public Sans
    fontSize: 1.5rem
    fontWeight: 600
  body-md:
    fontFamily: Public Sans
    fontSize: 1rem
    fontWeight: 400
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: 0.12em
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.tertiary-hover}"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 16px
  input-field:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px
---

## Overview

Architectural Minimalism meets Journalistic Gravitas. The UI evokes a premium
matte finish — a high-end broadsheet or a contemporary gallery. Generous
whitespace, hairline rules, and a single confident accent do the work. Nothing
glows; nothing floats. Structure is communicated through type and alignment
rather than shadow and color.

## Colors

The palette is rooted in high-contrast neutrals and a single accent color.

- **Primary (#1A1C1E):** Deep ink for headlines and core text.
- **Secondary (#6C7278):** Sophisticated slate for borders, captions, metadata.
- **Tertiary (#B8422E):** "Boston Clay" — the sole driver for interaction
  (primary buttons, the winning result, active states).
- **Neutral (#F7F5F2):** Warm limestone foundation, softer than pure white.

Use the accent sparingly: one clay element per visual group. Everything else is
ink on limestone, separated by hairline `outline` rules.

## Typography

Public Sans carries headlines and body. Space Grotesk is reserved for
`label-caps` — small, letter-spaced, uppercase labels and metadata (the
"editorial caption" voice). Headlines are tight (-0.02em); captions are airy
(+0.12em).

## Layout

Mobile-first, single column, centered measure (max ~640px). The `spacing` scale
is binary — 8px and 16px — composed into larger rhythm. Sections are divided by
hairline rules rather than cards-on-cards.

## Components

- **button-primary:** Clay background, limestone text, 4px radius, Space Grotesk
  caps. Darkens to `tertiary-hover` on hover.
- **card:** Limestone surface framed by a single `outline` hairline, 8px radius.
  The winning result inverts to ink/clay for emphasis.
- **input-field:** Limestone surface, hairline border, ink text; the border
  shifts to clay on focus.

## Do's and Don'ts

- **Do** let whitespace and hairlines define structure.
- **Do** keep clay as the single point of interaction per group.
- **Don't** introduce drop shadows, gradients, or additional accent hues.
- **Don't** use pure white (#FFFFFF) as a background — always warm limestone.
