# MiniMynt QA Checklist v2

## Visual QA (15 points)
1. [ ] Brand color is teal #0D9488 throughout (no forest green remnants)
2. [ ] Adult primary is navy #1A365D (buttons, header logos, chips)
3. [ ] Manrope font loads on web (check DevTools Network tab)
4. [ ] All buttons have visible turquoise teal focus ring on Tab key navigation
5. [ ] Section labels are sentence-case (not ALLCAPS) everywhere
6. [ ] All reward amounts are displayed in teal green (#0D9488)
7. [ ] Vipps button is always orange (#FF5B24), never teal
8. [ ] PiggyLogo appears in: EarningsHero, RoleSelectScreen, LandingScreen hero
9. [ ] All cards have Elevation.md shadow (neutral, not colored)
10. [ ] Modal sheets have rounded top corners (borderTopLeftRadius 20)
11. [ ] Empty states show icon + title + subtitle (not blank screen)
12. [ ] Progress bar height is 6px (not 8px or 10px)
13. [ ] Landing page hero has navy background with floating shapes
14. [ ] Skeleton loaders show when app first loads (before data hydrates)
15. [ ] No hardcoded hex colors in component styles (all use tokens)

## Interaction QA
1. [ ] Logout completely clears state — no stale data after logout
2. [ ] DevRoleSwitcher bar visible in dev mode on web (Forelder/Barn/Ut buttons)
3. [ ] Card hover lifts slightly (translateY -1 to -2px) on desktop
4. [ ] Card micro-tilt on hover: subtle 3D perspective effect
5. [ ] Button scale-down on press (0.96–0.97) feels satisfying
6. [ ] Vipps button hover: gradient shift + translateY(-1px)
7. [ ] Approve task → card disappears smoothly (FadeOut animation)
8. [ ] Take task → transitions to "Din oppgave" chip without jank
9. [ ] Modal open: slide-up animation from bottom
10. [ ] Modal close: smooth dismiss
11. [ ] Tab navigation (keyboard) works through all interactive elements
12. [ ] Page transitions: fade + subtle slide (200-300ms)

## Responsive QA
1. [ ] iPhone 14 Pro (393px): no horizontal scroll, no overflow
2. [ ] maxWidth 480px respected (content centered on desktop)
3. [ ] Landing page maxWidth 1200px (wider layout on desktop)
4. [ ] Tab bar readable at 393px width
5. [ ] Cards don't overflow screen at 393px
6. [ ] Modal sheet takes max 90% viewport height
7. [ ] FAB (floating action button) not obscured by tab bar
8. [ ] Font sizes scale correctly (no truncation at 393px)

## Functional QA
1. [ ] Adult can create tasks (FAB in TasksScreen)
2. [ ] Child can take available tasks
3. [ ] Child can mark task as done
4. [ ] Adult sees pending tasks in ApprovalScreen
5. [ ] Adult can approve → task moves to Vipps section
6. [ ] Adult can reject → task returns to Ledig
7. [ ] Vipps payment modal shows correct total and task breakdown
8. [ ] "Mark paid" marks tasks as Betalt
9. [ ] Child sees earned amount in EarningsHero
10. [ ] Profile shows correct name/phone for each role
