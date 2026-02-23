// MiniMynt Design Tokens — v5
// Skandinavisk premium teal. Bold turquoise identity × calm navy structure.

export const Colors = {
  // ── Brand (refined teal / turquoise) ────────────────────────────────────
  brand:          '#0D9488',   // teal-600 — bold, refined, not neon
  brandDark:      '#0B7A70',   // pressed / deep
  brandLight:     '#14B8A8',   // hover teal-400
  brandSurface:   '#F0FDFA',   // teal-50 — very light teal bg
  brandMuted:     '#CCFBF1',   // teal-100 — subtle tint

  // ── Adult accent (deep navy) ────────────────────────────────────────────
  adultPrimary:   '#1A365D',
  adultLight:     '#2C4F8A',   // hover navy
  adultSurface:   '#EFF3FB',   // light blue tint
  adultMuted:     '#DBEAFE',   // subtle blue

  // ── Surfaces ────────────────────────────────────────────────────────────
  bgPrimary:      '#FFFFFF',
  bgSurface:      '#F7F8FA',   // neutral near-white
  bgCard:         '#FFFFFF',

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary:    '#111827',
  textSecondary:  '#6B7280',
  textTertiary:   '#9CA3AF',
  textInverse:    '#FFFFFF',

  // ── Vipps ───────────────────────────────────────────────────────────────
  vippsOrange:        '#FF5B24',
  vippsOrangePressed: '#E5501F',

  // ── Status ──────────────────────────────────────────────────────────────
  statusSuccess: '#059669',
  statusWarning: '#D97706',
  statusDanger:  '#DC2626',
  statusNeutral: '#9CA3AF',

  // ── Borders ─────────────────────────────────────────────────────────────
  borderDefault: '#E5E7EB',
  borderSubtle:  '#F3F4F6',
  borderBrand:   '#99F6E4',   // teal-200

  // ── Focus & overlay ────────────────────────────────────────────────────
  borderFocus:       '#1A365D',
  childBorderFocus:  '#0D9488',
  overlayScrim:      'rgba(17,24,39,0.50)',

  // ── Backward-compat aliases ─────────────────────────────────────────────
  bgSecondary:    '#F7F8FA',
  brandDeep:      '#0B7A70',
  childPrimary:   '#0D9488',
  childDark:      '#0B7A70',
  childSurface:   '#F0FDFA',
  childMuted:     '#CCFBF1',
} as const;

// Gradient color arrays — use with expo-linear-gradient
export const Gradients = {
  brandHero:   ['#0D9488', '#14B8A8'] as const,
  adultHero:   ['#1A365D', '#2C4F8A'] as const,
  childHero:   ['#0D9488', '#2DD4BF'] as const,
  savingsGoal: ['#0B7A70', '#0D9488'] as const,
  earningsBg:  ['#0D9488', '#14B8A8'] as const,
  warmGold:    ['#D97706', '#F59E0B'] as const,
} as const;

export const Spacing = {
  xs:   4,
  sm:   8,
  sm2:  12,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
} as const;

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  full: 9999,
} as const;

export const FontSize = {
  caption: 11,
  label:   13,
  body:    15,
  heading: 18,
  title:   22,
  display: 28,
  hero:    36,
  mega:    48,
} as const;

export const FontWeight = {
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

export const FontFamily = {
  regular:  'Manrope_400Regular',
  medium:   'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold:     'Manrope_700Bold',
} as const;

export const Elevation = {
  none: {},
  sm: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  brand: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

export const Layout = {
  screenPadding:       20,
  screenPaddingBottom: 32,
  sectionGap:          28,
  cardPadding:         16,
  cardGap:             8,
  listRowMinHeight:    52,
  listRowVertical:     14,
  emptyStatePaddingV:  40,
  modalPadding:        24,
  modalPaddingBottom:  36,
  modalTitleGap:       24,
  fieldGap:            12,
  buttonGroupGap:      8,
  fabBottom:           32,
  fabRight:            24,
  appMaxWidth:         480,
  landingMaxWidth:     1200,
} as const;

export const LineHeight = {
  tight:  18,
  normal: 22,
  loose:  28,
  hero:   44,
  mega:   56,
} as const;

// Task status -> color mapping
export const StatusColor: Record<string, string> = {
  Ledig:    Colors.statusNeutral,
  Tatt:     Colors.adultPrimary,
  Ferdig:   Colors.statusWarning,
  Godkjent: Colors.statusSuccess,
  Avvist:   Colors.statusDanger,
  Betalt:   Colors.statusSuccess,
};

// Task status -> display label
export const StatusLabel: Record<string, string> = {
  Ledig:    'Ledig',
  Tatt:     'Pågående',
  Ferdig:   'Venter',
  Godkjent: 'Godkjent',
  Avvist:   'Avvist',
  Betalt:   'Betalt',
};
