# MiniMynt Design Rules (Duolingo-Inspired)

## Overview
These rules are derived from Duolingo's proven engagement patterns. They prioritize clarity, immediate feedback, and celebration moments to encourage financial literacy in families.

---

## Rule 1: **Big, Rounded Tap Targets**
Primary action buttons must be minimum 48px height with generous padding. Use borderRadius of 24px or higher for a friendly, inviting feel that signals friendliness and approachability.

*Implementation: All primary action buttons use `minHeight: 48px`, `borderRadius: 24px`, and vertical padding of at least 16px. Secondary buttons can be slightly smaller (40px) but never below.*

---

## Rule 2: **Celebration Animations on Task Completion**
Every completed action (chore approval, reward earned, streak reached) triggers an immediate celebration animation: confetti burst, emoji animation, or scale-up effect lasting 400-600ms.

*Implementation: Wrap completion handlers with `triggerCelebration()` that runs Reanimated animations. Use 0.4-0.6s duration with `spring` easing for playfulness.*

---

## Rule 3: **Prominent Progress Indicators**
Show progress visually on every screen: streak counters, task completion bars, level/XP progress. Progress bars should use color: bright green (#1E5C3A) for child mode, accent gold (#FFD700) for adult mode.

*Implementation: Place progress bars above fold. Use `LinearGradient` for visual depth. Update in real-time with smooth animations (200ms transitions).*

---

## Rule 4: **Bold Numbers Hierarchy**
Rewards, points, streaks, and balance amounts must be displayed in large, bold fonts (28px+) using contrasting colors. Numbers are the highest priority in visual hierarchy—they communicate status at a glance.

*Implementation: Use fontSize: 32-48px for metrics, fontWeight: '700' or '800'. Always place on solid backgrounds for readability. Child mode: green text (#1E5C3A), Adult mode: gold text (#FFD700).*

---

## Rule 5: **Color-Coded Mode Distinction**
Strictly separate Adult Mode (dark navy #0D1B2A backgrounds with gold accents) and Child Mode (bright green #1E5C3A backgrounds with vibrant contrasts). No ambiguity—users should know which mode they're in instantly.

*Implementation: Set global theme on app load. Use theme-aware colors via CSS-in-JS or theme provider. Never mix mode colors on the same screen unless indicating a transition.*

---

## Rule 6: **Streak Visibility and Reward Emphasis**
Display active streaks prominently (top of home screen, at least 3x daily). Use flame emoji or custom streak icon. When a streak is broken, show empathetic messaging, not harsh penalties.

*Implementation: Create a dedicated StreakWidget component. Update every 24 hours via background job. Show countdown timer for next eligible action to encourage return.*

---

## Rule 7: **Immediate Feedback on Every Interaction**
Every tap, swipe, or input must receive instant visual feedback: button press state, loading spinner, toast notification, or haptic feedback. Never leave users wondering if their action registered.

*Implementation: Use `onPressIn`/`onPressOut` for button states. Show 100ms press animation. Use `react-native-gesture-handler` for smooth interactions. Pair with `hapticFeedback` (light pulse).*

---

## Rule 8: **Clear Call-to-Action Buttons with Action Verbs**
Every button uses direct, action-oriented text: "Earn Reward," "Complete Chore," "Claim Badge," not "OK," "Yes," or "Submit." Button text immediately clarifies what happens on tap.

*Implementation: Audit all Button labels before commit. Use `{verb} {object}` pattern. Keep text to 2-3 words max. Bold the button text.*

---

## Rule 9: **Generous Spacing and Breathing Room**
Minimum 16px margin between card sections, 24px between major sections. Use whitespace strategically to reduce cognitive load and draw focus to important elements.

*Implementation: Define spacing constants: `SPACING_XS = 8px`, `SPACING_SM = 12px`, `SPACING_MD = 16px`, `SPACING_LG = 24px`. Apply consistently via utility functions or style objects.*

---

## Rule 10: **Celebratory Badge Unlocks**
When a user earns a new badge, show full-screen celebration modal with: large badge graphic (120px+), confetti animation, sound effect, and "Share Achievement" button. Make badges feel earned and significant.

*Implementation: Create `BadgeUnlockModal` component. Trigger on achievement unlock via event. Use `LottieView` for confetti. Include optional share-to-family feature via internal notification system.*

---

## Rule 11: **Empty States with Encouragement**
Empty screens (no chores, no badges, no rewards) should never be blank. Show friendly empty-state graphics, motivational copy, and a clear call-to-action to fill the void (e.g., "Create your first chore").

*Implementation: Create `EmptyState` component with: illustration (80px SVG), heading, description, and primary CTA button. Rotate messages for variety on repeat visits.*

---

## Rule 12: **Loading States with Progress Indication**
Never use generic spinners. Show skeleton screens, progress bars, or animated placeholders that hint at what's loading. Especially important for child mode—maintain engagement during waits.

*Implementation: Use `react-native-skeleton-content` or custom Reanimated animations. For child mode, use fun skeleton animations (color pulse, gentle bounce). Estimated load time: 2-3 seconds max.*

---

## Rule 13: **Error States with Actionable Recovery**
Errors should include: empathetic emoji, clear explanation (avoid jargon), and a primary "Retry" button. Never show raw error codes. Support offline mode gracefully with retry-on-connection restoration.

*Implementation: Create `ErrorBoundary` component. Use status constants (e.g., `ERROR_NETWORK`, `ERROR_PERMISSION`). Map to user-friendly messages. Offer "Contact Parent" button in child mode for persistent errors.*

---

## Rule 14: **Micro-interactions on Numbers**
When a number changes (balance updated, points earned, streak incremented), trigger a subtle animation: scale up 1.1x, color flash, or numeric counter animation. Make progress tactile and celebratory.

*Implementation: Wrap number displays in `Animated.Text`. Detect value changes with `useEffect`. Trigger spring animation on change. Duration: 300-400ms for visibility without distraction.*

---

## Rule 15: **Consistent Icon + Label Pairing**
Every icon must pair with a text label, especially in child mode. No orphaned icons. Use simple, rounded icon styles (12px stroke weight or thicker) that match the app's friendly aesthetic.

*Implementation: Use icon library with rounded variants (e.g., `react-native-vector-icons` with custom rounded set or `Feather` icons). All icons: size 24px minimum, color matched to text or theme accent.*

---

## Rule 16: **Haptic Feedback on Key Moments**
Pair major interactions with haptic feedback: heavy pulse on reward claim, light pulse on navigation, medium pulse on streak milestone. Reinforces positive behavior without sound dependency.

*Implementation: Use `react-native-haptic-feedback`. Map interaction type to feedback pattern: `notification.heavy`, `notification.light`, `selection`. Test on both iOS and Android.*

---

## Implementation Checklist

- [ ] All buttons meet 48px minimum height and 24px border radius
- [ ] Every task completion triggers celebration animation
- [ ] Progress indicators visible on home, task, and reward screens
- [ ] Number metrics use 32px+ bold fonts with theme-appropriate colors
- [ ] Adult and Child modes are visually distinct with zero overlap
- [ ] Streak counter on home screen, updated every 24 hours
- [ ] All interactions have immediate visual/haptic feedback
- [ ] Every button uses action-verb copy (no generic "OK"/"Submit")
- [ ] Spacing constants defined and applied consistently
- [ ] Badge unlocks show full-screen modal with confetti
- [ ] Empty states include graphics, copy, and CTA
- [ ] Loading states use skeleton screens or animated placeholders
- [ ] Errors are friendly, actionable, and never show raw codes
- [ ] Number changes trigger scale/color animations
- [ ] Icons always paired with labels
- [ ] Key interactions paired with haptic feedback
