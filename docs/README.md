# MiniMynt — Prosjektdokumentasjon

Denne mappen inneholder alle strategiske og tekniske dokumenter for MiniMynt.

## Innhold

| Fil | Beskrivelse |
|-----|-------------|
| `founder-packet.md` | Kjerndokument — produktvisjon, forretningsmodell, målgruppe |
| `01-positioning.md` | Markedsposisjonering og konkurrentanalyse |
| `02-v1-spec.md` | V1 produktspesifikasjon og krav |
| `03-growth-playbook.md` | Vekststrategi og go-to-market |
| `strategic-directive.md` | Strategiske retningslinjer og prioriteringer |
| `system_architecture.md` | Teknisk arkitektur og systemdesign |
| `decision_log.md` | Logg over viktige beslutninger og begrunnelser |

## Kom i gang (utvikling)

```bash
git clone https://github.com/Emanuelthorp/minimynt-app.git
cd minimynt-app
npm install
npx expo start --web
```

Åpne `http://localhost:8081` i nettleseren.

## Prosjektstruktur

```
minimynt-app/
├── src/
│   ├── components/     # Gjenbrukbare UI-komponenter
│   ├── constants/      # Design tokens (tokens.ts)
│   ├── navigation/     # Stack + tab navigatorer
│   ├── screens/        # Alle skjermer (adult/, child/, auth/, landing/)
│   └── store/          # State management (AppContext, types, persistence)
├── docs/               # Strategi og produktdokumentasjon (denne mappen)
├── web/                # Web-spesifikke filer (index.html)
├── assets/             # Bilder og ikoner
├── DESIGN_RULES.md     # UI/UX designregler
├── QA_CHECKLIST.md     # QA-sjekkliste (45 punkter)
└── TODO.md             # Gjenstående oppgaver
```

## Demo-kode

OTP-kode for testing: **1234**

---

*MiniMynt er en prototype. Ikke tilknyttet Vipps AS.*
