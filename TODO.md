# MiniMynt — TODO / Deferred Items

## Critical (before production)

- [ ] **Real authentication** — Replace mock OTP ("1234") with actual SMS gateway (e.g., Twilio Verify or Firebase Auth)
- [ ] **Real Vipps integration** — Replace mock payment modal with Vipps eCom API or Vipps MobilePay SDK
- [ ] **Backend / sync** — Currently all state is local AsyncStorage only. Add a backend (e.g., Supabase, Firebase) for multi-device sync
- [ ] **Adult phone validation** — Adult can currently log in with any 8-digit number; should be tied to a real account

## UX / Polish

- [ ] **Animations** — Add Reanimated 2 celebrations on task completion (confetti, scale bounce per DESIGN_RULES.md)
- [ ] **Haptic feedback** — Add `expo-haptics` on button taps, task approvals, and payments
- [ ] **Skeleton loaders** — Replace ActivityIndicator with skeleton screens during load
- [ ] **Empty state illustrations** — Add SVG illustrations for empty task lists, no children, etc.
- [ ] **Pull-to-refresh** — Add RefreshControl on all list screens
- [ ] **Avatar images** — Option to use camera/photo (expo-image-picker is installed but unused)

## Features

- [ ] **Task templates** — Pre-built task library (vasking, rydding, handling, etc.)
- [ ] **Recurring tasks** — Weekly/daily repeating tasks
- [ ] **Savings goals** — Child can set a savings goal with progress bar
- [ ] **Notifications** — Push notifications when task is approved/rejected (expo-notifications)
- [ ] **Task history / ledger** — Paginated history of all past transactions
- [ ] **Multiple adults** — Currently single adult per household

## Technical Debt

- [ ] **Navigation type safety** — Export ParamList types from RootNavigator and thread through to screen props
- [ ] **Error boundaries** — Add React error boundary around NavigationContainer
- [ ] **Test suite** — Unit tests for reducer (store/AppContext), integration tests for auth flow
- [ ] **Accessibility** — Add accessibilityLabel to all TouchableOpacity and icon-only buttons
- [ ] **State migration** — Add versioned schema migration for AsyncStorage (for future breaking changes)
- [ ] **Ledger month reset** — Auto-reset paidOutThisMonth when calendar month changes
- [ ] **Node version** — Project was scaffolded on Node 18; upgrade to Node 20+ for full React Native 0.81 support. `npx expo start` fails on Node 18 with `TypeError: configs.toReversed is not a function` (metro-config uses Array.toReversed which requires Node 20). Run `nvm use 20` or install Node 20 to run the dev server. TypeScript compilation (`npx tsc --noEmit`) passes cleanly on Node 18.

## Known Limitations

- Role selection is permanent (by design) — child cannot switch to adult view
- 48h task expiry is computed on render, not enforced server-side
- Vipps "payment" is a UI mock only — no actual money movement
