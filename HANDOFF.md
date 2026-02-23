# MiniMynt — Utviklerhandoff

Dette dokumentet er ment for enhver utvikler som overtar prosjektet.
Det dekker hva som er bygget, hvordan det fungerer, hva som gjenstår, og fallgruver å unngå.

---

## Nåværende tilstand (februar 2026)

### Hva er ferdig ✅

**Kjernefunksjonalitet:**
- Komplett oppgaveflyt: Ledig → Tatt → Ferdig → Godkjent/Avvist → Betalt
- Avviste oppgaver kan gjenåpnes til "Ledig"
- Forelder kan opprette, redigere og slette oppgaver
- Barn kan ta tilgjengelige oppgaver og melde dem ferdige
- Vipps deeplink: åpner Vipps-appen med beløp og telefonnummer pre-utfylt
- 3-stegs betalingsflyt: Gjennomgang → Venter (pulserende animasjon) → Suksess
- Logg ut: atomisk (`clearAsyncStorage` + `RESET_STATE`) — ingen stale state
- Månedlig ledger-reset: detekterer automatisk ny måned
- Utløpte oppgaver (>48t) ryddes ved oppstart

**Familie-håndtering:**
- Legg til barn (navn + telefon + emoji-avatar)
- Rediger barn (navn + emoji — telefon er ID og kan ikke endres)
- Fjern barn (med bekreftelsesdialog)

**Design system v5:**
- Manrope-font (400/500/600/700)
- Teal #0D9488 (brand) + Navy #1A365D (adult)
- Alle design tokens i `src/constants/tokens.ts`
- PiggyLogo SVG (react-native-svg, animate prop)
- Komplett komponentbibliotek (se README.md)

**UX-polish:**
- Toast-notifikasjoner (godkjenn/avvis/betaling)
- Skeleton loaders i HomeScreen og child/TasksScreen (800ms minimum)
- Tab-bar badge på "Godkjenn" med antall ventende
- Micro-tilt på kort (hover, web)
- Vipps-knapp gradient-hover
- PiggyLogo gentle bob-animasjon
- Landing page med animerte bakgrunnsformer og scroll-reveal

**Dev-verktøy:**
- `DevRoleSwitcher`-bar (kun `__DEV__` + web): Forelder/Barn/Ut-knapper
- `?boot=adult` / `?boot=child` URL-param for headless screenshot-testing

---

### Hva mangler ⛔

**Kritisk for produksjon:**

| Oppgave | Prioritet | Estimat |
|---------|-----------|---------|
| Ekte SMS OTP (Twilio/Firebase) | Høy | 1–2 dager |
| Vipps eCom API (Merchant Agreement) | Høy | 3–5 dager + avtale |
| Backend/sync (Supabase anbefales) | Høy | 3–5 dager |
| Brukerautentisering knyttet til telefon | Høy | 1–2 dager |

**Viktig:**

| Oppgave | Notat |
|---------|-------|
| Push-notifikasjoner | expo-notifications (ikke installert) |
| Oppgavemaler | Forhåndslagde norske husarbeidsmaler |
| Gjentagende oppgaver | Ukentlig/daglig gjentakelse |
| Flerenhets-støtte | Krever backend |
| Error boundaries | Legg til rundt NavigationContainer |
| Tilgjengelighetsetiketter | accessibilityLabel på alle ikontomter |

---

## Arkitektur

### State management

```
AppContext (src/store/AppContext.tsx)
  ├── useReducer (14 action types)
  ├── AsyncStorage persistence (saveState på alle state-endringer)
  ├── loadState() ved oppstart (replayer lagret state)
  ├── logout() = clearState() + RESET_STATE (atomisk)
  └── isLoading flag (vis skeleton under hydration)
```

**Viktig:** Alt lever lokalt. Ingen server. Ingen sync. State forsvinner hvis bruker sletter app-data.

### Navigasjonstre

```
RootNavigator
  ├── AuthNavigator (Stack) — når roleLock === null
  │   ├── LandingScreen
  │   ├── RoleSelectScreen
  │   ├── PhoneScreen
  │   └── OTPScreen
  ├── AdultTabs (BottomTab) — når roleLock === 'adult'
  │   ├── HomeScreen
  │   ├── FamilyScreen
  │   ├── TasksScreen (med FAB)
  │   ├── ApprovalScreen (med Vipps-modal)
  │   └── ProfileScreen
  └── ChildTabs (BottomTab) — når roleLock === 'child'
      ├── TasksScreen
      ├── WaitingScreen
      └── ProfileScreen
```

### Oppgave-livssyklus

```typescript
// Statuser i rekkefølge:
'Ledig'    // Forelder opprettet — synlig for alle barn
'Tatt'     // Barn tok oppgaven (takenBy = child.phone, takenAt = now)
'Ferdig'   // Barn meldte ferdig (completedAt = now)
'Godkjent' // Forelder godkjente (approvedAt = now) → vises i Vipps-seksjonen
'Avvist'   // Forelder avviste → kan gjenåpnes til Ledig med REOPEN_TASK
'Betalt'   // Vipps-utbetaling bekreftet (paidAt = now)
```

### Vipps-integrasjon (nåværende)

```typescript
// VippsButton.tsx — deeplink til Vipps-appen:
Linking.openURL(`vipps://payment?phone=${phone}&amount=${amount * 100}&message=MiniMynt%20oppgaver`)

// ApprovalScreen.tsx — 3-stegs modal:
modalStep 1: Gjennomgang (summary + VippsButton)
modalStep 2: Venter (pulserende oransje sirkel + "Bekreft betalt"-knapp)
modalStep 3: Suksess (grønn hak, auto-lukk 2 sek)
```

**For ekte Vipps-integrasjon** trenger du:
1. Vipps Merchant Agreement (vipps.no/bedrift)
2. Vipps eCom API v2 eller Vipps MobilePay SDK
3. Backend for å håndtere callbacks/webhooks
4. Merchant Serial Number (MSN) og API-nøkler

---

## Kjente fallgruver

### 1. Node-versjon
Krever **Node 20+**. `Array.toReversed()` brukes av metro-config og finnes ikke i Node 18.
```bash
nvm use 20  # eller: nvm install 20
```

### 2. WSL2 og localhost
Fra Windows fungerer ikke `localhost:8081`. Bruk WSL2-IP:
```bash
ip addr show eth0 | grep 'inet '  # finn IP (f.eks. 172.19.x.x)
# Åpne: http://172.19.x.x:8081
```

### 3. AsyncStorage på web
På web bruker react-native-async-storage localStorage med prefikset `@AsyncStorage:`.
Nøkkelen er `@AsyncStorage:minimynt_state`. Kan inspiseres i Chrome DevTools → Application → Local Storage.

### 4. Task ID-kollisjoner
Task-IDer genereres med `Math.random().toString(36).slice(2) + Date.now().toString(36)`.
Ikke kryptografisk unike — OK for prototype, bytt til `uuid` v4 i produksjon.

### 5. Telefonnummer som ID
Barn identifiseres med telefonnummer. Duplikatsjekk finnes, men ingen verifisering.
I produksjon: bruk en UUID fra backend som ID, telefon kun for autentisering.

---

## Design-regler (summary)

**Les `DESIGN_RULES.md` for full spec. Nøkkelpunkter:**

1. **Ingen gamification** — ingen XP, streaks, konfetti, poeng
2. **70/20/10-regelen** — 70% nøytral, 20% navy, 10% teal
3. **Teal kun på** — CTA-knapper, pengebeløp, fremdrift, PiggyLogo
4. **Vipps-oransje** (#FF5B24) **kun** på Vipps-knappen
5. **Norsk tekst overalt** — ingen engelske fallbacks i UI
6. **Sentence case** — section labels er aldri ALLCAPS
7. **Beløp i "XX kr"** — NOK, ingen desimaler for hele tall
8. **Elevation.md** — nøytral shadow (`#111827`) på alle kort

---

## Nyttige kommandoer

```bash
# Start dev-server
npx expo start --web

# TypeScript-sjekk
npx tsc --noEmit

# Bygg web
npx expo export --platform web

# Sjekk hvilke filer som er endret
git log --oneline -10

# Test Vipps deeplink (på mobil)
# Åpne appen i Expo Go og trykk Vipps-knappen
```

---

## Prompt-tips for AI-assistert utvikling

Når du jobber med Claude Code på dette prosjektet:

```
# Alltid spesifiser kontekst:
"MiniMynt Expo-app, tokens i src/constants/tokens.ts.
Bruk eksisterende komponenter (Card, Button, EmptyState etc).
Norsk tekst. Ingen gamification. 70/20/10-fargeregel."

# For UI-arbeid:
"Følg DESIGN_RULES.md. Brand = #0D9488 teal.
Adult = #1A365D navy. Sentence case på labels."

# For state-arbeid:
"Bruk useAppContext(). Dispatch action types fra src/store/types.ts.
Alle nye actions må legges til i types.ts og AppContext reducer."
```

---

## Kontakt og tilgang

| Person | GitHub | Rolle |
|--------|--------|-------|
| Emanuel Thorp | Emanuelthorp | Grunnlegger / eier |
| Shalfred | Shalfred | Utvikler (write-tilgang) |

**Repo:** https://github.com/Emanuelthorp/minimynt-app

---

*Sist oppdatert: februar 2026*
