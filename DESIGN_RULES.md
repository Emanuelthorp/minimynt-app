# MiniMynt Design Rules — UI Kit v0.1

## Philosophy
Premium utility. Scandinavian fintech. Light surfaces, generous whitespace, calm typography.
Every element earns its place. No decoration. No gamification.

---

## Principles

1. **No gamification.** No XP, streaks, badges, confetti, celebrations, leaderboards, or behavioral hooks.
2. **Informational feedback only.** "Oppgaven er godkjent." "Betaling sendt." No fanfare.
3. **One primary action per screen.** Reduce decision fatigue.
4. **48px minimum tap targets.** Especially critical for children.
5. **Consistent status colors.** Same badge color for same status everywhere.
6. **Norwegian language everywhere.** No English fallbacks in UI.
7. **Amounts in "XX kr" format.** NOK, no decimals for whole numbers.
8. **Empty states use helpful text.** No illustrations, no mascots.
9. **Vipps orange (#FF5B24) is reserved** for the "Betal med Vipps" button only.
10. **Light theme.** White/light-gray surfaces. Dark text. Subtle accents.

---

## Color Tokens

### Surfaces
| Token | Value | Usage |
|-------|-------|-------|
| bg.primary | #FFFFFF | Main background |
| bg.secondary | #F5F6F8 | Screen backgrounds, grouped sections |
| bg.card | #FFFFFF | Card surfaces |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| text.primary | #1A1A2E | Headings, body text |
| text.secondary | #6B7280 | Labels, muted copy |
| text.tertiary | #9CA3AF | Timestamps, hints |
| text.inverse | #FFFFFF | On colored surfaces |

### Adult accent
| Token | Value | Usage |
|-------|-------|-------|
| adult.primary | #2563EB | Primary actions, links |
| adult.primaryMuted | #EFF6FF | Badges, selected states |
| adult.surface | #F0F4FF | Subtle screen tint |

### Child accent
| Token | Value | Usage |
|-------|-------|-------|
| child.primary | #059669 | Primary actions |
| child.primaryMuted | #ECFDF5 | Badges |
| child.surface | #F0FDF4 | Subtle screen tint |

### Vipps
| Token | Value | Usage |
|-------|-------|-------|
| vipps.orange | #FF5B24 | "Betal med Vipps" button only |

### Status
| Token | Value | Usage |
|-------|-------|-------|
| status.success | #059669 | Betalt, Godkjent |
| status.warning | #D97706 | Venter, Ferdig |
| status.danger | #DC2626 | Avvist, destructive |
| status.neutral | #6B7280 | Ledig, inactive |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| border.default | #E5E7EB | Card borders, dividers |
| border.subtle | #F3F4F6 | Light separators |

---

## Typography

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| display | 28 | 700 | Screen titles |
| title | 22 | 600 | Section headings |
| heading | 18 | 600 | Card headings, amounts |
| body | 15 | 400 | Body text |
| label | 13 | 500 | Labels, buttons, badges |
| caption | 11 | 400 | Timestamps, hints |

Font: System default (SF Pro / Roboto). Line height: 1.4x.

---

## Spacing (4px grid)

| Token | Value |
|-------|-------|
| xs | 4 |
| sm | 8 |
| md | 16 |
| lg | 24 |
| xl | 32 |
| xxl | 48 |

---

## Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 8 | Badges |
| md | 12 | Cards, inputs |
| lg | 16 | Buttons, modals |
| full | 9999 | Pills, avatars |

---

## Elevation

| Token | Style | Usage |
|-------|-------|-------|
| none | — | Flat elements |
| sm | 0 1px 2px rgba(0,0,0,0.05) | Cards |
| md | 0 4px 12px rgba(0,0,0,0.08) | FAB, elevated cards |
| lg | 0 8px 24px rgba(0,0,0,0.12) | Modals |

---

## Components

- **Button:** primary / secondary / danger / vipps. Min height 48px.
- **Card:** White surface + border + shadow.sm. Padding md. Radius md.
- **Badge:** Pill (radius.full). Semantic color.
- **StatusBadge:** Predefined per TaskStatus.
- **Input:** Height 48px. Border. Radius md. Focus = accent border.
- **ListRow:** Full-width row, 48px min height, right accessory.
- **ScreenHeader:** Left-aligned display text. No emoji.
- **VippsButton:** Orange bg, white text. Payment only.
- **ScreenContainer:** SafeAreaView + ScrollView. bg.secondary default.

---

## Adult vs Child distinction

Same components, same typography, same layout. Difference:
- Adult: bg.secondary + blue accent
- Child: child.surface + green accent
- Tab bar: white bg, accent-colored active icon

---

## Status mapping

| TaskStatus | Color | Label |
|------------|-------|-------|
| Ledig | status.neutral | Ledig |
| Tatt | adult.primary / child.primary | Tatt |
| Ferdig | status.warning | Venter |
| Godkjent | status.success | Godkjent |
| Avvist | status.danger | Avvist |
| Betalt | status.success | Betalt |
