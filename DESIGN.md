---
name: AI Mock Interview Platform
colors:
  background: '#070A13'
  surface: '#0F172A'
  surface-dim: '#1E293B'
  surface-bright: '#1E293B'
  surface-container-lowest: '#020617'
  surface-container-low: '#0B0F19'
  surface-container: '#0F172A'
  surface-container-high: '#1E293B'
  surface-container-highest: '#334155'
  on-surface: '#F8FAFC'
  on-surface-variant: '#94A3B8'
  inverse-surface: '#F1F5F9'
  inverse-on-surface: '#0F172A'
  outline: '#334155'
  outline-variant: '#475569'
  surface-tint: '#8B5CF6'
  primary: '#8B5CF6'
  on-primary: '#FFFFFF'
  primary-container: '#7C3AED'
  on-primary-container: '#F5F3FF'
  inverse-primary: '#C084FC'
  secondary: '#10B981'
  on-secondary: '#FFFFFF'
  secondary-container: '#059669'
  on-secondary-container: '#ECFDF5'
  tertiary: '#F43F5E'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#E11D48'
  on-tertiary-container: '#FFF1F2'
  error: '#EF4444'
  on-error: '#FFFFFF'
  error-container: '#DC2626'
  on-error-container: '#FEF2F2'
  primary-fixed: '#EDE9FE'
  primary-fixed-dim: '#DDD6FE'
  on-primary-fixed: '#2E1065'
  on-primary-fixed-variant: '#5B21B6'
  secondary-fixed: '#D1FAE5'
  secondary-fixed-dim: '#A7F3D0'
  on-secondary-fixed: '#064E3B'
  on-secondary-fixed-variant: '#047857'
  tertiary-fixed: '#FFE4E6'
  tertiary-fixed-dim: '#FECDD3'
  on-tertiary-fixed: '#4C0519'
  on-tertiary-fixed-variant: '#9F1239'
  surface-variant: '#1E293B'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system for the AI Mock Interview Platform centers on **Sophisticated Intelligence, Calm Authority, and Cutting-Edge Performance**. Since mock interviews are high-stakes and nerve-wracking, the visual interface should feel incredibly premium, secure, and reassuring, using a dark-mode-first aesthetic with glowing elements to invoke the futuristic feel of interacting with an advanced AI.

The visual style is **Neon Glassmorphic Dark Mode**, using:
- **Deep Slate and Obsidian Backgrounds:** Black `#070A13` with dark blue-gray container surfaces to ease eye strain.
- **Glowing Elements (Voice Orb):** A dynamic, pulsating radial gradient orb in the center that transitions between purple (Interviewer Speaking), emerald green (User Speaking), and amber/yellow (Processing/Evaluating).
- **Glassmorphism:** Semi-transparent white/purple cards with thin borders and heavy backdrop blurs to represent premium tech.

## Colors
- **Primary (Electric Violet):** Used for primary buttons, selection outlines, and AI active states.
- **Secondary (Neon Emerald):** Represents success states, candidate speaking indicators, and positive score indicators.
- **Tertiary/Warning (Coral Red):** Used for closing signals, alerts, error states, and "End Interview" buttons.
- **Backgrounds:** A cohesive scale of obsidian black and slate grys (`#070A13` to `#1E293B`).

## Typography
- **Outfit:** A futuristic, geometric sans-serif font pairing perfectly with technical branding, used for display text and headings.
- **Inter:** The default standard for highly legible text in dashboards, session transcription, and detailed feedback reports.

## Components
- **The Voice Orb:** Circular, 192px/256px sized glowing sphere with scale animations and fluid particle effects.
- **Dashboard Stats Grid:** Metric cards showing performance scores (0-100) using circular score rings and gradient text.
- **Feedback Accordion:** Collapsible questions showing candidate transcripts and detailed score breakdowns.
