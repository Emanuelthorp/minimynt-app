# MiniMynt

**Familiøkonomi-app for norske familier.**
Barn gjør oppgaver → Forelder godkjenner → Vipps betaler.

Ingen falsk valuta. Ingen gamification. Ekte penger.

---

## Hva er MiniMynt?

MiniMynt er en strukturert familiøkonomiplatform som gjør husarbeid om til reelle inntekter. Foreldre oppretter og eier systemet. Barn fullfører oppgaver. Betaling skjer i ekte penger via Vipps (0,5 % gebyr).

**Flyten:**
```
Oppgave ledig → Barn tar oppgaven → Barn melder ferdig
→ Forelder godkjenner → Vipps betaler
```

---

## Kom i gang

### Krav
- Node 20+ (viktig — prosjektet bruker Array.toReversed som krever Node 20)
- `nvm use 20` hvis du har nvm

```bash
git clone https://github.com/Emanuelthorp/minimynt-app.git
cd minimynt-app
npm install
npx expo start --web
```

Åpne `http://localhost:8081` i Chrome.

> **WSL2-brukere:** Bruk WSL2-IP-en i stedet for localhost.
> Finn den med: `ip addr show eth0 | grep 'inet '`
> Eksempel: `http://172.19.x.x:8081`

### Demo-kode
OTP-kode for testing: **1234**

### Dev-rolle-bytte
En svart bar nederst (kun i dev-modus) lar deg bytte mellom Forelder/Barn/Ut uten OTP-flyt.

---

## Teknisk stack

| Teknologi | Versjon | Bruk |
|-----------|---------|------|
| Expo SDK | 54 | App-rammeverk |
| React Native | 0.81.5 | UI |
| TypeScript | 5.x | Typesikkerhet |
| React Navigation | 7.x | Navigasjon |
| AsyncStorage | - | Lokal persistering |
| react-native-reanimated | ~4.1.1 | Animasjoner |
| react-native-svg | 15.12.1 | SVG-logo |
| @expo-google-fonts/manrope | - | Typografi |
| framer-motion | ^12 | Web-animasjoner (landing) |

---

## Prosjektstruktur

```
minimynt-app/
├── src/
│   ├── components/          # Gjenbrukbare UI-komponenter
│   │   ├── Button.tsx        # Primær/sekundær knapp, hover/press-states
│   │   ├── Card.tsx          # Kort med elevation og micro-tilt hover
│   │   ├── EarningsHero.tsx  # Inntektsoversikt-kort (barn)
│   │   ├── EmptyState.tsx    # Tom tilstand: ikon + tittel + undertittel
│   │   ├── Input.tsx         # Tekstfelt med fokusring
│   │   ├── ListRow.tsx       # Liste-rad med venstre/høyre slot
│   │   ├── PiggyLogo.tsx     # SVG-sparegris (animate prop for bobbing)
│   │   ├── ProgressBar.tsx   # Fremdriftslinje
│   │   ├── ScreenContainer.tsx # Scroll-wrapper med max-bredde 480px
│   │   ├── ScreenHeader.tsx  # Topptittel med venstre/høyre slots
│   │   ├── SkeletonLoader.tsx # Pulserende lasteplaceholder
│   │   ├── StatCard.tsx      # Statistikk-kort
│   │   ├── Toast.tsx         # Flytende varslingsmelding (useToast hook)
│   │   └── VippsButton.tsx   # Vipps-knapp med deeplink og gradient-hover
│   │
│   ├── constants/
│   │   └── tokens.ts         # Design tokens v5 (farger, spacing, typografi)
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx # Hoved-navigator + DevRoleSwitcher
│   │   ├── AdultTabs.tsx     # Tab-bar for forelder (5 tabs + badge)
│   │   └── ChildTabs.tsx     # Tab-bar for barn (3 tabs)
│   │
│   ├── screens/
│   │   ├── adult/
│   │   │   ├── HomeScreen.tsx      # Forelder-hjem: greeting, navy hero, statusliste
│   │   │   ├── FamilyScreen.tsx    # Legg til/rediger/fjern barn
│   │   │   ├── TasksScreen.tsx     # Opprett/rediger oppgaver (FAB)
│   │   │   ├── ApprovalScreen.tsx  # Godkjenn/avvis + Vipps-utbetaling
│   │   │   └── ProfileScreen.tsx   # Profil + logg ut
│   │   ├── child/
│   │   │   ├── TasksScreen.tsx     # Ta oppgaver, meld ferdig
│   │   │   ├── WaitingScreen.tsx   # Status på alle mine oppgaver
│   │   │   └── ProfileScreen.tsx   # Profil + total tjent + logg ut
│   │   ├── auth/
│   │   │   ├── RoleSelectScreen.tsx # Velg Forelder/Barn
│   │   │   ├── PhoneScreen.tsx      # Skriv inn telefonnummer
│   │   │   └── OTPScreen.tsx        # Verifiser kode (mock: 1234)
│   │   └── landing/
│   │       └── LandingScreen.tsx    # Markedsføringside for nye brukere
│   │
│   └── store/
│       ├── AppContext.tsx    # useReducer + AsyncStorage + logout helper
│       ├── types.ts          # Alle typer: Task, Child, State, Action
│       └── persistence.ts   # loadState / saveState / clearState
│
├── docs/                    # Strategi og produktdokumentasjon
├── web/
│   └── index.html           # Web-spesifikk HTML (Manrope font, CSS reset)
├── assets/                  # App-ikoner og splash
├── DESIGN_RULES.md          # UI/UX-regler
├── QA_CHECKLIST.md          # 45-punkts QA-sjekkliste
└── TODO.md                  # Gjenstående oppgaver
```

---

## Design system (tokens v5)

| Token | Verdi | Bruk |
|-------|-------|------|
| `Colors.brand` | `#0D9488` | Teal — CTA-knapper, beløp, fremdrift |
| `Colors.adultPrimary` | `#1A365D` | Navy — forelder-hero, ikoner |
| `Colors.bgPrimary` | `#FFFFFF` | Hvit bakgrunn |
| `Colors.bgSurface` | `#F7F8FA` | Nøytral nær-hvit |
| `Colors.textPrimary` | `#111827` | Primær tekst |
| `Colors.vippsOrange` | `#FF5B24` | Kun Vipps-knapp |

**70/20/10-regelen:** 70% nøytrale flater, 20% navy, 10% teal.
Teal brukes **kun** på: CTA-knapper, pengebeløp, fremdriftsfyll, PiggyLogo.

Font: **Manrope** (400/500/600/700)
Spacing: 8px system (4, 8, 12, 16, 24, 32, 48, 64)
Radius: sm=8, md=12, lg=16, xl=20

---

## State management

All tilstand lever i `AppContext` (useReducer + AsyncStorage):

```
State {
  adultPhone: string | null
  childPhone: string | null
  roleLock: 'adult' | 'child' | null
  children: Child[]
  tasks: Task[]
  ledger: { paidOutThisMonth, feeDue, month }
}
```

**Oppgave-statuser:**
```
Ledig → Tatt → Ferdig → Godkjent → Betalt
                      ↘ Avvist → (kan gjenåpnes til Ledig)
```

**Logg ut:**
```typescript
const { logout } = useAppContext();
await logout(); // clearAsyncStorage + RESET_STATE
```

---

## Viktige notater

- **Vipps er mock** — deeplink åpner appen, men ingen ekte API-kall
- **OTP er mock** — kode 1234 fungerer alltid
- **Data er lokal** — ingenting synkroniseres til server
- **Dev-bar** vises kun i `__DEV__` (forsvinner i production build)

Se `TODO.md` for full liste over hva som gjenstår før produksjon.
Se `docs/` for produktstrategi og arkitektur.

---

*MiniMynt er en prototype. Ikke tilknyttet Vipps AS.*
