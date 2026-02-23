# MiniMynt — TODO

## Kritisk (før produksjon)

- [ ] **Ekte SMS OTP** — Bytt mock-kode "1234" med SMS-gateway (Twilio Verify, Firebase Auth eller Supabase Auth)
- [ ] **Ekte Vipps API** — Deeplink er implementert, men trenger Vipps Merchant Agreement + eCom API v2 for faktiske betalinger
- [ ] **Backend / sync** — All state er lokal AsyncStorage. Legg til backend (Supabase anbefalt) for flerenhets-støtte og sikkerhet
- [ ] **Brukerautentisering** — Telefonnummer er ikke verifisert, hvem som helst kan logge inn med et 8-sifret nummer

## UX / Polish

- [ ] **Haptic feedback** — `expo-haptics` ved knappetrykk, oppgavegodkjenning og utbetaling
- [ ] **Pull-to-refresh** — `RefreshControl` på alle lister
- [ ] **Avatar-bilder** — Mulighet til å bruke kamera/bilde (`expo-image-picker` er installert men ubrukt)
- [ ] **Oppgave-bekreftelse** — Animasjon/feedback når barn melder oppgave ferdig

## Funksjoner

- [ ] **Oppgavemaler** — Forhåndslagde norske husarbeidsmaler (vasking, rydding, handling, lekser etc.)
- [ ] **Gjentagende oppgaver** — Ukentlig/daglig gjentakelse
- [ ] **Sparemål** — Barn kan sette sparemål med fremdriftslinje
- [ ] **Push-notifikasjoner** — Varsling når oppgave godkjennes/avvises (`expo-notifications`)
- [ ] **Transaksjonshistorikk** — Paginert historikk over alle utbetalinger
- [ ] **Flere foreldre** — For øyeblikket kun én voksen per husstand

## Teknisk gjeld

- [ ] **Navigasjons-typesikkerhet** — Eksporter ParamList-typer fra RootNavigator til alle skjermkomponenter
- [ ] **Error boundaries** — Legg til React error boundary rundt NavigationContainer
- [ ] **Testsuite** — Enhetstester for reducer (store/AppContext), integrasjonstester for auth-flyt
- [ ] **Tilgjengelighet** — `accessibilityLabel` på alle TouchableOpacity og ikon-knapper
- [ ] **State-migrering** — Versjonert skjema-migrering for AsyncStorage ved fremtidige breaking changes
- [ ] **UUID for task-ID** — Bytt `Math.random()` ID med `uuid` v4 i produksjon

## Fjern før produksjon

- [ ] **DevRoleSwitcher** — Allerede gated bak `__DEV__`, men verifiser at produksjons-build ikke eksponerer den
- [ ] **`?boot=` URL-param** — Fjern boot-param logikk i RootNavigator (kun for dev/screenshot)
- [ ] **Hardkodede testtelefoner** — `'99999999'` og `'88888888'` i DevRoleSwitcher

---

## Ferdig ✅

- [x] Komplett oppgaveflyt (Ledig → Tatt → Ferdig → Godkjent/Avvist → Betalt)
- [x] Avviste oppgaver kan gjenåpnes til "Ledig" (REOPEN_TASK)
- [x] Logg ut: atomisk clearAsyncStorage + RESET_STATE (ingen stale state)
- [x] Månedlig ledger-reset (RESET_LEDGER)
- [x] Utløpte oppgaver ryddes ved oppstart (CLEANUP_EXPIRED_TASKS)
- [x] Vipps deeplink (vipps://payment?phone=...&amount=...)
- [x] 3-stegs betalingsflyt med pulserende animasjon og suksess-skjerm
- [x] Toast-notifikasjoner (godkjenn/avvis/betaling)
- [x] Skeleton loaders (HomeScreen + child/TasksScreen, 800ms minimum)
- [x] Tab-bar badge på "Godkjenn" (antall ventende)
- [x] Legg til / Rediger / Fjern barn i FamilyScreen
- [x] Belønningsvalidering (1–9999 kr)
- [x] Design system v5 (teal #0D9488, navy #1A365D, Manrope)
- [x] PiggyLogo SVG med animate prop
- [x] Micro-animasjoner (card tilt, Vipps gradient, button physics)
- [x] Landing page (navy hero, animerte former, scroll-reveal)
- [x] DevRoleSwitcher (kun __DEV__)
- [x] Komplett komponentbibliotek (Button, Card, Toast, EmptyState, etc.)
