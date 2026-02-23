# Prompt-Bibliotek for Claude / Claude Code

**Kuratert:** 2026-02-22 | **Kilder:** 55+ bidragsytere | **48 Skill Cards** | **Format:** Skill Cards

---

## Innholdsfortegnelse

| # | Navn | Kategori |
|---|------|----------|
| 1 | Klar & Direkte | Grunnleggende prompt-teknikk |
| 2 | XML-Tag Strukturering | Grunnleggende prompt-teknikk |
| 3 | Multishot (Few-Shot) | Grunnleggende prompt-teknikk |
| 4 | Tanke-Kjede (Chain of Thought) | Grunnleggende prompt-teknikk |
| 5 | Rolle-Prompt via System | Grunnleggende prompt-teknikk |
| 6 | Prompt-Kjeding | Grunnleggende prompt-teknikk |
| 7 | Utvidet Tenkning | Grunnleggende prompt-teknikk |
| 8 | Kontekst-Plassering (Long Context) | Context engineering |
| 9 | Just-in-Time Henting | Context engineering |
| 10 | Kompaktering & Oppsummering | Context engineering |
| 11 | Strukturert Notatføring | Context engineering |
| 12 | HANDOFF.md Sesjon-Kontinuitet | Context engineering |
| 13 | Utforsk-Planlegg-Implementer-Commit | Claude Code-arbeidsflyt |
| 14 | Plan Mode Først | Claude Code-arbeidsflyt |
| 15 | Intervju-Mønsteret | Claude Code-arbeidsflyt |
| 16 | Skribent/Anmelder-Mønsteret | Claude Code-arbeidsflyt |
| 17 | Fan-Out Migrering | Claude Code-arbeidsflyt |
| 18 | CLAUDE.md — Presis Kontekst | CLAUDE.md-design |
| 19 | Progressiv Utlevering | CLAUDE.md-design |
| 20 | Instruksjonsbudsjett 150-200 | CLAUDE.md-design |
| 21 | Sub-Agent Delegering | Agent-orkestrering |
| 22 | Orkestrator-Arbeider Mønster | Agent-orkestrering |
| 23 | Konkurrerende Hypoteser | Agent-orkestrering |
| 24 | Bølge-Basert Teamkjøring | Agent-orkestrering |
| 25 | Selv-Verifikasjon | Verifikasjon & kvalitet |
| 26 | Hooks for Determinisme | Verifikasjon & kvalitet |
| 27 | Sjekkpunkt-Protokollen | Verifikasjon & kvalitet |
| 28 | Tre-Lags Modellruting | Kostnad & ytelse |
| 29 | Aggressiv Konteksthåndtering | Kostnad & ytelse |
| 30 | Git-Checkout Per Sesjon | Kostnad & ytelse |
| 31 | PRP-Metoden (Product Requirements Prompt) | Context engineering |
| 32 | Memory Bank Arkitektur | CLAUDE.md-design |
| 33 | Ultrathink On-Demand | Avansert / eksperimentelt |
| 34 | Evaluator-Optimaliserer Mønster | Agent-orkestrering |
| 35 | Ruting-Mønster (Input-Klassifisering) | Grunnleggende prompt-teknikk |
| 36 | Slash Commands & Skills | Claude Code-arbeidsflyt |
| 37 | Poka-Yoke Verktøydesign | Verifikasjon & kvalitet |
| 38 | Dokument & Tøm-Metoden | Context engineering |
| 39 | ContextKit Faseplanlegging | Claude Code-arbeidsflyt |
| 40 | Superpowers TDD-Arbeidsflyt | Claude Code-arbeidsflyt |
| 41 | Anti-Drift Konfigurasjon | Agent-orkestrering |
| 42 | Hook-Basert Prompt-Forbedring | Avansert / eksperimentelt |
| 43 | LLM-som-Dommer Kvalitetsporter | Verifikasjon & kvalitet |
| 44 | Forklar Først, Valider Etterpå | Context engineering |
| 45 | Kontekst-Rot Forebygging (MAKER) | Context engineering |
| 46 | Multi-Agent Observability | Agent-orkestrering |
| 47 | Prompt-Caching Optimalisering | Kostnad & ytelse |
| 48 | Sesjonslogg-Gjenoppretting | Avansert / eksperimentelt |

---

## Skill Cards

---

### 1. Klar & Direkte

**Kategori:** Grunnleggende prompt-teknikk
**Når bruke:** Alltid. Grunnmuren for alle andre teknikker.

**Prompt-mal:**
```
Din oppgave er å [spesifikk handling] for [formål/målgruppe].

Instruksjoner:
1. [Steg med eksakt format]
2. [Steg med eksakt format]
3. [Steg med forventet output]

Data å behandle: {{INPUT}}
```

**Hvorfor det fungerer:** Claude er som en briljant nyansatt uten kontekst om dine normer. Eksplisitte instruksjoner eliminerer gjetning. Gullregel: vis prompten til en kollega — er de forvirret, blir Claude det også.

**Fallgruver:**
- Vage instruksjoner som "fiks login-buggen" uten symptom, lokasjon og definisjon av "fikset"
- Utelate kontekst (målgruppe, formål) som tvinger Claude til å gjette

**Kilde:** [Anthropic Docs — Be clear and direct](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct) | Anthropic

---

### 2. XML-Tag Strukturering

**Kategori:** Grunnleggende prompt-teknikk
**Når bruke:** Når prompten har flere komponenter (kontekst, instruksjoner, eksempler, data) som kan forveksles.

**Prompt-mal:**
```xml
<context>{{BAKGRUNN}}</context>

<data>{{INPUT_DATA}}</data>

<instructions>
1. Analyser [aspekt] basert på <data>.
2. Sammenlign med <reference>{{REF}}</reference>.
3. Presenter funn i <findings>-tagger.
</instructions>
```

**Hvorfor det fungerer:** XML-tagger separerer prompt-deler, reduserer feiltolkning, og gjør output parsbart for etterbehandling.

**Fallgruver:**
- Inkonsistente tagnavn som forvirrer Claude
- Glemme å referere til tagnavnene i instruksjonsteksten

**Kilde:** [Anthropic Docs — Use XML tags](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags) | Anthropic

---

### 3. Multishot (Few-Shot)

**Kategori:** Grunnleggende prompt-teknikk
**Når bruke:** Når du trenger konsistent, strukturert output — spesielt for klassifisering, ekstraksjon og formatering.

**Prompt-mal:**
```xml
<examples>
<example>
Input: "Pakken kom aldri"
Kategori: Levering
Sentiment: Negativ
Prioritet: Høy
</example>
<example>
Input: "Elsker den nye fargen!"
Kategori: Produkt
Sentiment: Positiv
Prioritet: Lav
</example>
</examples>

Analyser nå: {{INPUT}}
```

**Hvorfor det fungerer:** Eksempler reduserer feiltolkning, tvinger ensartet struktur, og grunner abstrakte instruksjoner i konkrete demonstrasjoner. 3-5 eksempler dekker normalt behovet.

**Fallgruver:**
- For like eksempler — Claude plukker opp utilsiktede mønstre
- Manglende dekning av grensetilfeller

**Kilde:** [Anthropic Docs — Multishot prompting](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting) | Anthropic

---

### 4. Tanke-Kjede (Chain of Thought)

**Kategori:** Grunnleggende prompt-teknikk
**Når bruke:** Komplekse oppgaver som krever flerstegs resonering — matematikk, analyse, arkitekturbeslutninger.

**Prompt-mal:**
```
[Enkel]     "Tenk steg for steg."
[Styrt]     "Tenk før du skriver. Først, vurder X. Deretter, evaluer Y. Til slutt, produser Z."
[Strukturert] "Tenk i <thinking>-tagger. Først, vurder X.
               Deretter, evaluer Y. Skriv svaret i <answer>-tagger."
```

**Hvorfor det fungerer:** Gjennomgang av steg reduserer feil i logikk og matte. Strukturert tenkning med XML-tagger separerer resonering fra output og muliggjør automatisk parsing.

**Fallgruver:**
- Glemme å be Claude *vise* tenkningen — uten output skjer ingen reell resonering
- Bruke CoT på trivielle oppgaver som bare øker latens

**Kilde:** [Anthropic Docs — Chain of thought](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought) | Anthropic

---

### 5. Rolle-Prompt via System

**Kategori:** Grunnleggende prompt-teknikk
**Når bruke:** Når domeneekspertise er viktig — juridisk analyse, finansiell modellering, teknisk review.

**Prompt-mal:**
```python
# System-parameter:
system="Du er generaladvokat i et Fortune 500 teknologiselskap."

# Brukermelding:
"Vi vurderer denne programvarelisensavtalen for vår
 kjerneinfrastruktur: <contract>{{KONTRAKT}}</contract>
 Analyser den for potensielle risikoer. Gi din profesjonelle vurdering."
```

**Hvorfor det fungerer:** Rolletildeling forbedrer nøyaktighet i domenespesifikke scenarier og tilpasser kommunikasjonstone. En rollesprompt Claude fanger kritiske problemer en generisk Claude overser.

**Fallgruver:**
- Blande rolle og oppgaveinstruksjoner i system-prompten
- Generiske roller som "Du er en hjelpsom assistent" som ikke tilfører noe

**Kilde:** [Anthropic Docs — System prompts](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts) | Anthropic

---

### 6. Prompt-Kjeding

**Kategori:** Grunnleggende prompt-teknikk
**Når bruke:** Flerstegs-oppgaver som forskning, innholdsproduksjon, eller iterativ forbedring der hvert steg krever Claudes fulle oppmerksomhet.

**Prompt-mal:**
```
Prompt 1: [Ekstraher/Analyser] → Output i <result>-tagger → {{RESULTAT_1}}
Prompt 2: [Transformer/Utkast] med <input>{{RESULTAT_1}}</input> → {{RESULTAT_2}}
Prompt 3: [Vurder/Grader] <draft>{{RESULTAT_2}}</draft> → {{TILBAKEMELDING}}
Prompt 4: [Forbedre] med <draft>{{RESULTAT_2}}</draft> og <feedback>{{TILBAKEMELDING}}</feedback>
```

**Hvorfor det fungerer:** Hver deloppgave får Claudes fulle oppmerksomhet. Enklere deloppgaver produserer klarere output. Feil er lettere å lokalisere til spesifikke ledd.

**Fallgruver:**
- Forsøke å håndtere alt i én prompt — Claude dropper steg
- Manglende XML-tagger for tydelig overlevering mellom ledd

**Kilde:** [Anthropic Docs — Chain prompts](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-prompts) | Anthropic

---

### 7. Utvidet Tenkning

**Kategori:** Grunnleggende prompt-teknikk
**Når bruke:** Komplekse STEM-problemer, begrensningsoptimering, kodeoppgaver som krever verifikasjon.

**Prompt-mal:**
```
Tenk grundig og detaljert gjennom dette problemet.
Vurder flere tilnærminger og vis fullstendig resonnement.
Prøv alternative metoder hvis første tilnærming ikke fungerer.

Skriv en funksjon som beregner [X].
Verifiser løsningen med testtilfeller:
- tilfelle_1, tilfelle_2, tilfelle_3
Fiks eventuelle problemer du finner.
```

**Hvorfor det fungerer:** Utvidet tenkning lar Claude bygge mentale modeller og jobbe gjennom sekvensielle logiske steg. Modellens kreativitet i tilnærming overgår ofte evnen til å foreskrive optimal tenke-prosess.

**Fallgruver:**
- Over-spesifisere steg-for-steg prosess i stedet for å la Claude resonnere fritt
- Sende Claudes tenkning tilbake som bruker-input (forverrer resultater)

**Kilde:** [Anthropic Docs — Extended thinking tips](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips) | Anthropic

---

### 8. Kontekst-Plassering (Long Context)

**Kategori:** Context engineering
**Når bruke:** Arbeid med store dokumenter (20K+ tokens), flere dokumenter, eller datarike oppgaver.

**Prompt-mal:**
```xml
<documents>
  <document index="1">
    <source>årsrapport_2025.pdf</source>
    <document_content>{{ÅRSRAPPORT}}</document_content>
  </document>
  <document index="2">
    <source>konkurrentanalyse.xlsx</source>
    <document_content>{{KONKURRENT}}</document_content>
  </document>
</documents>

Finn sitater fra dokumentene relevante for [oppgave]. Plasser i <quotes>-tagger.
Basert på sitatene, [utfør analyse]. Plasser resultater i <analysis>-tagger.
```

**Hvorfor det fungerer:** Dokumenter ØVERST + spørsmål NEDERST forbedrer responskvalitet med opptil 30%. Å be Claude sitere relevante passasjer først hjelper med å kutte gjennom "støy."

**Fallgruver:**
- Plassere lange dokumenter ETTER instruksjoner — forverrer ytelse
- Ikke be om sitatgrunnlag — fører til hallusinert eller svakt fundamentert analyse

**Kilde:** [Anthropic Docs — Long context tips](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips) | Anthropic

---

### 9. Just-in-Time Henting

**Kategori:** Context engineering
**Når bruke:** Når du bygger agenter som opererer over tid og må hente relevant informasjon dynamisk.

**Prompt-mal:**
```
# I stedet for å forhåndslaste alt:
Oppretthold lette identifikatorer (filstier, URLer, søkestrenger).
Last data dynamisk ved kjøretid når den faktisk trengs.

# System-prompt mønster:
<tool_guidance>
Bruk file_search-verktøyet KUN når du trenger spesifikk informasjon.
Ikke last alle filer på forhånd. Start med den mest relevante
filen basert på brukerens spørsmål.
</tool_guidance>
```

**Hvorfor det fungerer:** LLM-er har et begrenset "oppmerksomhetsbudsjett" som degraderes med kontekstlengde. Just-in-Time henting holder konteksten slank og relevant.

**Fallgruver:**
- Forhåndslaste alle filer "for sikkerhets skyld" — fyller kontekstvinduet
- For mange henterunder som øker latens unødvendig

**Kilde:** [Anthropic Engineering — Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic Engineering

---

### 10. Kompaktering & Oppsummering

**Kategori:** Context engineering
**Når bruke:** Når agentsamtaler nærmer seg kontekstgrensen under langvarige oppgaver.

**Prompt-mal:**
```
# I CLAUDE.md:
"Når du kompakterer, bevar alltid:
- Arkitekturbeslutninger tatt
- Uløste problemer
- Nøkkeldetaljer om implementasjon
- Liste over endrede filer
- Testkommandoer brukt"

# Manuell kompaktering:
/compact Fokuser på API-endringene

# Delvis kompaktering:
Esc+Esc → velg sjekkpunkt → "Oppsummer herfra"
```

**Hvorfor det fungerer:** Kontekst er en begrenset ressurs med avtakende grensenytte. Ytelse degraderes når token-antall øker grunnet n-squared parvise beregninger i transformer-oppmerksomhet.

**Fallgruver:**
- For aggressiv kompaktering som mister subtil men kritisk kontekst
- Ikke teste kompakteringsinstruksjoner på representative samtaler først

**Kilde:** [Anthropic Engineering — Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) + [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | Anthropic

---

### 11. Strukturert Notatføring

**Kategori:** Context engineering
**Når bruke:** Langvarige agentoppgaver der beslutninger og funn må overleve kontekstkompaktering.

**Prompt-mal:**
```
Oppretthold en NOTES.md-fil under arbeidet.
Etter hvert steg, oppdater den med:
- Hva ble gjort
- Hva ble besluttet og hvorfor
- Hva gjenstår
- Eventuelle blokkere

Trekk notatene tilbake i kontekst ved behov.
```

**Hvorfor det fungerer:** Eksterne notater overlever kompaktering og sesjonsgrenser. De fungerer som en "ekstern hukommelse" som agenten kan lese tilbake.

**Fallgruver:**
- Notater som blir for detaljerte og selv spiser kontekst
- Glemme å referere tilbake til notatene etter kompaktering

**Kilde:** [Anthropic Engineering — Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic Engineering

---

### 12. HANDOFF.md Sesjon-Kontinuitet

**Kategori:** Context engineering
**Når bruke:** Før kontekstgrense nås (~70-80% bruk), mellom sesjoner, eller ved verktøybytte.

**Prompt-mal:**
```markdown
# HANDOFF.md
## Oppgave: [tittel]
## Dato: [dato] | Branch: [branch] | Status: [pågår/blokkert]

### Mål
- [ ] [Mål 1]
- [x] [Mål 2 — fullført]

### Fullført
- [Beskrivelse av hva som ble gjort]

### Gjenstår
- [Oppgave som gjenstår]

### Mislykkede tilnærminger (OBLIGATORISK)
- [Tilnærming X] — feilet fordi [grunn]. Ikke prøv igjen.
```

**Hvorfor det fungerer:** Kontekst-amnesi er den største produktivitetsdreperen i lange sesjoner. HANDOFF.md dokumenterer hva som ble prøvd og feilet — sparer timer.

**Fallgruver:**
- Utelate mislykkede tilnærminger — nye sesjoner gjentar feil
- Bruke HANDOFF.md som permanent lagring i stedet for sesjons-spesifikk kontekst

**Kilde:** [willseltzer/claude-handoff](https://github.com/willseltzer/claude-handoff) | Will Seltzer + [4-Step Protocol](https://medium.com/@ilyas.ibrahim/the-4-step-protocol-that-fixes-claude-codes-context-amnesia-c3937385561c) | Ilyas Ibrahim + [Smart Handoff](https://blog.skinnyandbald.com/never-lose-your-flow-smart-handoff-for-claude-code/) | Sonovore

---

### 13. Utforsk-Planlegg-Implementer-Commit

**Kategori:** Claude Code-arbeidsflyt
**Når bruke:** Enhver ikke-triviell kodeoppgave der omfanget er uklart eller endringen berører flere filer.

**Prompt-mal:**
```
Fase 1 (Plan Mode): "Les /src/auth og forstå hvordan vi håndterer
  sesjoner og innlogging. Se også på env-håndtering for hemmeligheter."

Fase 2 (Plan Mode): "Jeg vil legge til Google OAuth. Hvilke filer
  må endres? Hva er sesjons-flyten? Lag en plan."
  [Ctrl+G for å redigere plan i teksteditor]

Fase 3 (Normal Mode): "Implementer OAuth-flyten fra planen din.
  Skriv tester for callback-handleren, kjør testsuiten og fiks feil."

Fase 4 (Normal Mode): "Commit med beskrivende melding og opprett PR."
```

**Hvorfor det fungerer:** Separering av research og planlegging fra implementering forhindrer løsning av feil problem. Plan Mode sikrer at Claude leser filer uten å gjøre endringer.

**Fallgruver:**
- La Claude hoppe rett til koding uten å utforske kodebasen først
- Over-planlegge trivielle oppgaver der overhead overstiger gevinst

**Kilde:** [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | Anthropic

---

### 14. Plan Mode Først

**Kategori:** Claude Code-arbeidsflyt
**Når bruke:** Ikke-trivielle endringer. Mest anbefalt praksis på tvers av nesten alle kilder.

**Prompt-mal:**
```
# Aktiver: Shift+Tab to ganger, eller /plan

"Jeg vil legge til [funksjon]. Les relevant kode,
 identifiser berørte filer, og lag en steg-for-steg plan.
 Ikke gjør noen endringer ennå."

# Iterer på planen med Claude
# Ctrl+G åpner planen i ekstern editor
# Når fornøyd: bytt til Normal Mode → auto-accept edits
```

**Hvorfor det fungerer:** Plan Mode bruker færre tokens (ingen verktøykjøring). Gir validert tilnærming før kode skrives. Boris Cherny (Claude Code-skaperen) bruker dette mønsteret for hver PR.

**Fallgruver:**
- Hoppe over planning for "enkle" endringer som viser seg å være komplekse
- Ikke bruke Ctrl+G — manuell planitrekking i terminalen er ineffektivt

**Kilde:** [Boris Cherny workflow](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/) | Boris Cherny, Anthropic + [Plan Mode](https://code.claude.com/docs/en/common-workflows) | Anthropic

---

### 15. Intervju-Mønsteret

**Kategori:** Claude Code-arbeidsflyt
**Når bruke:** Større funksjoner der du ønsker å oppdage ukjente krav og edge cases før implementering.

**Prompt-mal:**
```
Jeg vil bygge [kort beskrivelse]. Intervju meg i detalj
med AskUserQuestion-verktøyet.

Spør om teknisk implementering, UI/UX, edge cases,
bekymringer og avveininger. Ikke still opplagte spørsmål,
grav i de vanskelige delene jeg kanskje ikke har vurdert.

Fortsett å intervjue til alt er dekket, skriv deretter
en komplett spesifikasjon til SPEC.md.
```

**Hvorfor det fungerer:** Claude spør om ting du kanskje ikke har vurdert. Produserer en skriftlig spec som kan brukes i en ny, ren sesjon for implementering.

**Fallgruver:**
- Bruke intervjuet som chat i stedet for å produsere en konkret SPEC.md
- Ikke starte ny sesjon for implementering — spec i gammel kontekst reduserer effektivitet

**Kilde:** [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | Anthropic

---

### 16. Skribent/Anmelder-Mønsteret

**Kategori:** Claude Code-arbeidsflyt
**Når bruke:** Når kvalitetssikring er viktig — en sesjon implementerer, en annen anmelder med ren kontekst.

**Prompt-mal:**
```
# Sesjon A (Skribent):
"Implementer rate limiting for våre API-endepunkter."

# Sesjon B (Anmelder — ren kontekst):
"Gjennomgå rate limiter-implementasjonen i
@src/middleware/rateLimiter.ts. Se etter edge cases,
race conditions, og konsistens med eksisterende middleware."

# Sesjon A (Tilbake):
"Her er review-tilbakemeldingene: [output fra B]. Adresser disse."
```

**Hvorfor det fungerer:** Ren kontekst gir bedre code review — Claude er ikke biased mot kode den nettopp skrev. Separasjon gir mer objektiv vurdering.

**Fallgruver:**
- Bruke samme sesjon for skriving og review — bias mot egen kode
- Ikke kommunisere spesifikke review-tilbakemeldinger tilbake til skribenten

**Kilde:** [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | Anthropic + [Builder.io](https://www.builder.io/blog/claude-code) | Steve Sewell

---

### 17. Fan-Out Migrering

**Kategori:** Claude Code-arbeidsflyt
**Når bruke:** Store migreringer eller analyser over mange filer — distribuer arbeid over parallelle Claude-instanser.

**Prompt-mal:**
```bash
# Generer oppgaveliste:
claude -p "List alle Python-filer som trenger migrering"

# Kjør i parallell:
for file in $(cat files.txt); do
  claude -p "Migrer $file fra React til Vue. Returner OK eller FAIL." \
    --allowedTools "Edit,Bash(git commit *)"
done

# Test på 2-3 filer først, juster prompt, kjør på resten.
```

**Hvorfor det fungerer:** Distribuert arbeid over parallelle instanser med `--allowedTools`-begrensning sikrer trygg, uovervåket kjøring i stor skala.

**Fallgruver:**
- Ikke teste prompten på noen få filer først — feil skalerer
- Glemme `--allowedTools` — Claude kan gjøre uventede endringer uten oppsyn

**Kilde:** [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | Anthropic

---

### 18. CLAUDE.md — Presis Kontekst

**Kategori:** CLAUDE.md-design
**Når bruke:** Hvert Claude Code-prosjekt. Gir persistent kontekst som Claude ikke kan utlede fra koden alene.

**Prompt-mal:**
```markdown
# Kodestil
- Bruk ES modules (import/export), ikke CommonJS (require)
- Destrukturer imports når mulig

# Arbeidsflyt
- Typsjekk etter endringer: npm run typecheck
- Kjør enkelttester, ikke hele suiten: npx jest path/to/test

# Kommandoer
- Build: npm run build
- Test enkeltfil: npx jest path/to/test
- Lint: npm run lint
```

**Hvorfor det fungerer:** Eliminerer gjentatte forklaringer og sikrer konsistent overholdelse av prosjektkonvensjoner på tvers av alle sesjoner.

**Fallgruver:**
- For mye innhold — Claude ignorerer viktige regler begravd i støy
- Inkludere selvfølgeligheter som "skriv ren kode" som sløser kontekst-tokens

**Kilde:** [Claude Code — CLAUDE.md](https://code.claude.com/docs/en/memory) | Anthropic + [HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md) | HumanLayer

---

### 19. Progressiv Utlevering

**Kategori:** CLAUDE.md-design
**Når bruke:** Når prosjektdokumentasjonen er for stor for én CLAUDE.md-fil.

**Prompt-mal:**
```markdown
# CLAUDE.md (rot — under 60 linjer)
## Stack
Next.js 16, Prisma 6, Supabase

## Kodestil
Se @docs/code-conventions.md

## Testing
Se @docs/testing-guide.md

## Arkitektur
Se @docs/architecture.md
```

**Hvorfor det fungerer:** CLAUDE.md i rot lastes alltid. `@`-referanser lar Claude laste detaljerte filer on-demand. Child-directory CLAUDE.md lastes kun når Claude leser filer i den mappen.

**Fallgruver:**
- Alle detaljer i rot-CLAUDE.md — for mange tokens, regler ignoreres
- Ikke bruke `@`-referanser — Claude finner aldri de detaljerte filene

**Kilde:** [HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md) | HumanLayer + [Claude Code Docs](https://code.claude.com/docs/en/memory) | Anthropic

---

### 20. Instruksjonsbudsjett 150-200

**Kategori:** CLAUDE.md-design
**Når bruke:** Ved design av CLAUDE.md — kvantitativ grense for effektivitet.

**Prompt-mal:**
```
Frontier LLM-er følger pålitelig 150-200 instruksjoner.
Claude Codes systemprompt inneholder ~50 allerede.
→ Budsjett: ~100-150 instruksjoner i CLAUDE.md.

Mål: Under 300 linjer totalt.
HumanLayers egen rot-fil: under 60 linjer.
Boris Chernys (Claude Code-skaperen): ~2.5K tokens.
```

**Hvorfor det fungerer:** For mange instruksjoner betyr at viktige regler drukner. Kvantitativ grense forhindrer den vanligste CLAUDE.md-feilen: oppblåsthet.

**Fallgruver:**
- Legge til nye regler uten å fjerne gamle — instruksjonstallet kryper
- Anta at "mer er bedre" — Claude presterer dårligere med støyete kontekst

**Kilde:** [HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md) | HumanLayer + [InfoQ — Cherny](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/) | Boris Cherny

---

### 21. Sub-Agent Delegering

**Kategori:** Agent-orkestrering
**Når bruke:** Kompleks research, fillesing, code review — alt som ville forurense hovedkonteksten.

**Prompt-mal:**
```
# I Claude Code:
"Bruk subagenter til å undersøke hvordan autentiserings-
systemet håndterer token-refresh, og om vi har eksisterende
OAuth-verktøy jeg bør gjenbruke."

# Subagent-definisjon (.claude/agents/security-reviewer.md):
---
name: security-reviewer
description: Gjennomgår kode for sikkerhetssårbarheter
tools: Read, Grep, Glob, Bash
model: opus
---
Du er en senior sikkerhets-ingeniør. Gjennomgå kode for:
- Injeksjonssårbarheter (SQL, XSS, command injection)
- Autentiserings- og autoriseringssvakheter
- Hemmeligheter i kode
Oppgi spesifikke linjereferanser og foreslåtte fikser.
```

**Hvorfor det fungerer:** Tydelig separasjon forhindrer kontekstforurensning. Hver subagent returnerer kondenserte oppsummeringer (1000-2000 tokens) av omfattende utforskning.

**Fallgruver:**
- Subagenter som returnerer rå, uoppsummert output
- Ikke scope undersøkelser smalt nok — uendelig utforskning

**Kilde:** [Claude Code — Sub-agents](https://code.claude.com/docs/en/sub-agents) | Anthropic + [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | VoltAgent

---

### 22. Orkestrator-Arbeider Mønster

**Kategori:** Agent-orkestrering
**Når bruke:** Komplekse oppgaver der en sentral LLM dynamisk bryter ned oppgaver og delegerer til arbeidere.

**Prompt-mal:**
```
# Sentral orkestrator (Opus) planlegger og koordinerer.
# Arbeidere (Sonnet) utfører spesifikke deloppgaver.

# UndeadList-mønsteret (24 spesialiserte agenter):
claude "Kjør full-audit workflow på src/"
claude "Kjør pre-commit workflow"
claude "Bruk fullstack-qa-orchestrator til å teste http://localhost:3000"

# Sjekkpunkt-protokoll:
Agenter MÅ oppgi planlagte endringer FØR kjøring.
"STOPP. Du spurte ikke om tillatelse." — håndhevings-frase.
```

**Hvorfor det fungerer:** Sentral koordinering med distribuert kjøring gir parallellitet uten kaos. Micro-endringer (én logisk endring per commit) forhindrer scope creep.

**Fallgruver:**
- Agenter som gjør endringer uten å rapportere planlagte steg først
- Manglende styringsregler for parallellisering vs. sekvensiell kjeding

**Kilde:** [undeadlist/claude-code-agents](https://github.com/undeadlist/claude-code-agents) | UndeadList + [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) | Anthropic Research

---

### 23. Konkurrerende Hypoteser

**Kategori:** Agent-orkestrering
**Når bruke:** Debugging — spawn flere teammedlemmer som undersøker ulike teorier parallelt.

**Prompt-mal:**
```
# Sett opp agent-team med konkurrerende hypoteser:
Teammedlem A: "Undersøk om feilen skyldes race condition i auth-middleware."
Teammedlem B: "Undersøk om feilen skyldes stale cache i session-store."
Teammedlem C: "Undersøk om feilen skyldes feil i database-migreringen."

# La dem diskutere:
"Ha dem snakke med hverandre for å motbevise hverandres
teorier, som en vitenskapelig debatt."
```

**Hvorfor det fungerer:** Parallell utforskning av flere teorier er raskere enn sekvensiell. Konkurranse mellom hypoteser avdekker svakheter i hver tilnærming.

**Fallgruver:**
- For mange parallelle spor — kontekstkostnad 3-4x solo-sesjoner
- Ikke la agentene kommunisere — mister debatten som avdekker sannhet

**Kilde:** [Addy Osmani — Claude Code Agent Teams](https://addyosmani.com/blog/claude-code-agent-teams/) | Addy Osmani

---

### 24. Bølge-Basert Teamkjøring

**Kategori:** Agent-orkestrering
**Når bruke:** Koordinering av multi-agent teams der oppgaver har avhengigheter.

**Prompt-mal:**
```json
// Oppgavebeskrivelser fungerer som agent-prompter:
{
  "id": "1",
  "subject": "Kjernefunksjoner returnerer 200 og gyldig HTML",
  "description": "[detaljert prompt for agenten]",
  "status": "pending",
  "blockedBy": []
}

// Bølge-mønster:
// Bølge 1: Oppgaver uten avhengigheter → parallell
// Bølge 2: Oppgaver som ventet på bølge 1 → parallell
// Bølge 3: Sluttverifisering
```

**Hvorfor det fungerer:** Avhengighetsgrafer skaper naturlige bølger. Oppgavebeskrivelsers spesifisitet korrelerer direkte med kjøringskvalitet.

**Fallgruver:**
- Vage oppgavebeskrivelser — agenten gjetter og gjør feil
- Ikke definere eksplisitte rutingsregler i CLAUDE.md — orkestratoren velger feil parallellisering

**Kilde:** [Alex Op — From Tasks to Swarms](https://alexop.dev/posts/from-tasks-to-swarms-agent-teams-in-claude-code/) | Alex Op + [Kieran Klaassen Gist](https://gist.github.com/kieranklaassen/4f2aba89594a4aea4ad64d753984b2ea) | Kieran Klaassen

---

### 25. Selv-Verifikasjon

**Kategori:** Verifikasjon & kvalitet
**Når bruke:** Alltid. Beskrives som "det ene med høyest utbytte du kan gjøre" i offisiell dokumentasjon.

**Prompt-mal:**
```
"Skriv en validateEmail-funksjon.
 Testtilfeller: user@example.com → true, 'invalid' → false, user@.com → false.
 Kjør testene etter implementering."

"[lim inn skjermbilde] Implementer dette designet.
 Ta et skjermbilde av resultatet og sammenlign med originalen.
 List forskjeller og fiks dem."

"Bygget feiler med denne feilen: [lim inn feil].
 Fiks det og verifiser at bygget lykkes. Adresser rotårsaken."
```

**Hvorfor det fungerer:** Uten klare suksesskriterier produserer Claude noe som *ser* riktig ut men ikke fungerer. Selv-verifikasjon lukker tilbakemeldingsløkken automatisk.

**Fallgruver:**
- Akseptere plausibelt-utseende implementasjoner uten verifikasjon
- Vage suksesskriterier som "gjør dashboardet bedre"

**Kilde:** [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | Anthropic + [Boris Cherny](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/) | Boris Cherny

---

### 26. Hooks for Determinisme

**Kategori:** Verifikasjon & kvalitet
**Når bruke:** Alt som MÅ skje hver gang — formatering, linting, sikkerhetsvalidering — i stedet for CLAUDE.md som er rådgivende.

**Prompt-mal:**
```json
// settings.json — PostToolUse auto-formatering:
"PostToolUse": [
    {"type": "command", "command": "bun run format || true"}
]

// PreToolUse sikkerhets-blokk:
"PreToolUse": [
    {"type": "command", "command": "python validate_no_rm_rf.py",
     "matcher": {"tool_name": "Bash"}}
]
// Exit code 2 = blokker utførelse
// Andre koder = vis stderr uten å stoppe
```

**Hvorfor det fungerer:** "I motsetning til CLAUDE.md-instruksjoner som er rådgivende, er hooks deterministiske og garanterer at handlingen skjer." Nøkkelinnsikt: CLAUDE.md for veiledning, hooks for garanti.

**Fallgruver:**
- Blokkere under skriving (confuses agenter midt i plan) — bruk heller hint-hooks
- Stole på CLAUDE.md for linting/formatering — det er rådgivende, ikke garantert

**Kilde:** [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide) | Anthropic + [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) | Disler + [Shrivu Shankar](https://blog.sshh.io/p/how-i-use-every-claude-code-feature) | Shrivu Shankar

---

### 27. Sjekkpunkt-Protokollen

**Kategori:** Verifikasjon & kvalitet
**Når bruke:** Alle implementasjonsoppgaver. Claude lager automatisk sjekkpunkter før endringer — bruk dem.

**Prompt-mal:**
```
# Claude sjekkpunkter automatisk. Bruk dem:
Esc+Esc eller /rewind → åpner sjekkpunkt-menyen

Alternativer:
- Gjenopprett kun samtale
- Gjenopprett kun kode
- Gjenopprett begge
- Oppsummer fra valgt melding

# Prøv risikable tilnærminger trygt:
"Prøv å refaktorere auth-modulen til async/await.
 Hvis det ikke fungerer, spoler vi tilbake."
```

**Hvorfor det fungerer:** Sjekkpunkter gjør eksperimentering gratis. Du kan si "prøv noe risikabelt" uten å bekymre deg for irreversible endringer.

**Fallgruver:**
- Sjekkpunkter sporer kun endringer gjort *av Claude*, ikke eksterne prosesser
- Erstatter ikke git — bruk git for permanent versjonskontroll

**Kilde:** [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | Anthropic

---

### 28. Tre-Lags Modellruting

**Kategori:** Kostnad & ytelse
**Når bruke:** Alltid i profesjonell bruk. Optimaliserer kostnad/kvalitet-forholdet.

**Prompt-mal:**
```
# Modellhierarki:
Opus  → Planlegging, arkitektur, sluttgjennomgang (lav frekvens, høy kvalitet)
Sonnet → Implementering, koding, bug-fiks (høy frekvens, standard)
Haiku  → Rutine-subagenter, enkel utforskning (lavest kostnad)

# Agent-team:
Lead-agent: Opus (koordinerer)
Teammedlemmer: Sonnet (utfører)
Utforsknings-subagenter: Haiku (søker)

# Subagent-konfig (.claude/agents/):
---
model: haiku  # Billigst for enkel utforskning
tools: Read, Grep, Glob
---
```

**Hvorfor det fungerer:** Opus for strategiske beslutninger, Sonnet for implementering, Haiku for rutine. Gjennomsnittlig utviklerkostnad: ~$6/dag, 90% under $12/dag.

**Fallgruver:**
- Bruke Opus for alt — unødvendig dyr for implementeringsoppgaver
- Bruke Haiku for komplekse beslutninger — sparer penger men produserer dårligere resultater

**Kilde:** [Claude Code Cost Docs](https://code.claude.com/docs/en/costs) | Anthropic + [Addy Osmani](https://addyosmani.com/blog/claude-code-agent-teams/) | Addy Osmani + [Boris Cherny](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/) | Boris Cherny

---

### 29. Aggressiv Konteksthåndtering

**Kategori:** Kostnad & ytelse
**Når bruke:** Mellom urelaterte oppgaver, etter 2 mislykkede korrigeringer, når kontekst fylles med irrelevant informasjon.

**Prompt-mal:**
```
# Mellom urelaterte oppgaver:
/clear

# Etter 2 mislykkede korrigeringer:
/clear → skriv bedre initialprompt med det du lærte

# Styrt kompaktering:
/compact Fokuser på API-endringene

# Anti-mønster: "Kjøkkenvask-sesjonen"
Aldri: start med oppgave A → spør noe urelatert →
       gå tilbake til A. Kontekst er nå full av støy.
```

**Hvorfor det fungerer:** En ren sesjon med bedre prompt slår nesten alltid en lang sesjon med akkumulerte korrigeringer. Gammel kontekst sløser tokens ved hver påfølgende melding.

**Fallgruver:**
- Korrigere Claude gjentatte ganger i stedet for å starte på nytt
- Anta at mer kontekst er bedre — støyete kontekst forverrer ytelse

**Kilde:** [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | Anthropic + [Shrivu Shankar](https://blog.sshh.io/p/how-i-use-every-claude-code-feature) | Shrivu Shankar

---

### 30. Git-Checkout Per Sesjon

**Kategori:** Kostnad & ytelse
**Når bruke:** Når du kjører flere parallelle Claude Code-sesjoner som endrer kode.

**Prompt-mal:**
```bash
# Boris Chernys mønster:
# Ikke bruk branches — bruk separate git checkouts:
git worktree add ../feature-a feature-a
git worktree add ../feature-b feature-b

# Kjør parallelle sesjoner:
# Terminal 1: claude (i ../feature-a)
# Terminal 2: claude (i ../feature-b)
# Terminal 3-5: flere parallelle sesjoner
# Web 1-10: claude.ai web-sesjoner

# Total: 5 lokale + 5-10 web = 10-15 parallelle sesjoner
```

**Hvorfor det fungerer:** Separate checkouts unngår filkonflikter mellom parallelle sesjoner. Git worktrees er mer effektive enn kloning fordi de deler .git-katalogen.

**Fallgruver:**
- Bruke branches i stedet for worktrees — merge-konflikter mellom parallelle sesjoner
- For mange parallelle sesjoner uten koordinering — motstridende endringer

**Kilde:** [Boris Cherny — InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/) | Boris Cherny, Anthropic + [Steve Sewell](https://www.builder.io/blog/claude-code) | Steve Sewell, Builder.io

---

### 31. PRP-Metoden (Product Requirements Prompt)

**Kategori:** Context engineering
**Når bruke:** Før implementering av nye funksjoner — automatisert generering av implementeringsprompt fra kodebase-analyse.

**Prompt-mal:**
```
# Fire-stegs PRP-arbeidsflyt:

1. CLAUDE.md → Globale regler (struktur, testing, stil)
2. INITIAL.md → Detaljert funksjonsspesifikasjon:
   "Legg til brukerautentisering med OAuth2.
    Se examples/ for lignende implementasjoner.
    API-docs: @docs/auth-api.md"
3. Generer PRP → Automatisk kodebase-analyse identifiserer:
   - Eksisterende mønstre å følge
   - Berørte filer og avhengigheter
   - Valideringsporter (testkommandoer som MÅ bestå)
4. Kjør → AI implementerer med iterativ validering

# Kritisk: Inkluder alltid en examples/ mappe med
# kodestruktur-mønstre, testing-tilnærminger, integrasjonseksempler.
```

**Hvorfor det fungerer:** PRP kompilerer oppgavespesifikasjoner til implementering som kode-kompilering. Eksempel-mappen er "kritisk" for suksess fordi den grunner abstrakte krav i konkrete mønstre.

**Fallgruver:**
- Hoppe over examples/ mappen — Claude gjetter i stedet for å følge etablerte mønstre
- Ikke inkludere valideringsporter — ingen automatisk kvalitetskontroll

**Kilde:** [coleam00/context-engineering-intro](https://github.com/coleam00/context-engineering-intro) | Cole Medin

---

### 32. Memory Bank Arkitektur

**Kategori:** CLAUDE.md-design
**Når bruke:** Prosjekter som trenger rik, flerdimensjonal hukommelse på tvers av sesjoner — ut over hva én CLAUDE.md kan håndtere.

**Prompt-mal:**
```markdown
# Strukturert memory bank (5 filer):
CLAUDE.md              → Kjerne prosjektkontekst (< 300 linjer)
CLAUDE-patterns.md     → Gjentakende designmønstre og løsninger
CLAUDE-decisions.md    → Arkitekturbeslutninger (ADR-format)
CLAUDE-troubleshooting.md → Kjente problemer og løsninger
CLAUDE-activeContext.md   → Gjeldende sesjonstilstand

# Oppdatering etter fullført oppgave:
/update memory bank

# Git-tracked for teamdeling
```

**Hvorfor det fungerer:** Separerer ulike typer hukommelse (mønstre vs. beslutninger vs. feilsøking) slik at Claude kan hente presis kontekst uten å laste alt. ADR-formatet gir strukturert beslutningshistorikk.

**Fallgruver:**
- For mange memory-filer — overhead overstiger nytte for små prosjekter
- Glemme å oppdatere etter oppgaver — hukommelsen blir utdatert

**Kilde:** [centminmod/my-claude-code-setup](https://github.com/centminmod/my-claude-code-setup) | centminmod + [russbeye/claude-memory-bank](https://github.com/russbeye/claude-memory-bank) | russbeye

---

### 33. Ultrathink On-Demand

**Kategori:** Avansert / eksperimentelt
**Når bruke:** Ekstremt komplekse problemer der standard tenkning ikke er tilstrekkelig — aktiveres on-demand via hook.

**Prompt-mal:**
```json
// UserPromptSubmit hook i settings.json:
// Prompter som slutter med "-u" får "ultrathink" lagt til
{
  "hooks": {
    "UserPromptSubmit": [{
      "type": "command",
      "command": "python detect_ultrathink_suffix.py"
    }]
  }
}

// Tenke-hierarki (økende budsjett):
// "think" < "think hard" < "think harder" < "ultrathink"

// Bruk: Skriv prompt som vanlig, legg til "-u" på slutten:
"Fiks race condition i betalings-pipeline-u"
```

**Hvorfor det fungerer:** Hvert nivå allokerer progressivt mer tenkningsbudsjett. Ultrathink gir Claude maksimal resoneringstid for de vanskeligste problemene uten å sløse ressurser på enkle oppgaver.

**Fallgruver:**
- Bruke ultrathink på trivielle oppgaver — sløser tokens og tid
- Ikke konfigurere hooken riktig — suffix gjenkjennes ikke

**Kilde:** [mckaywrigley/prompts](https://github.com/mckaywrigley/prompts) | McKay Wrigley

---

### 34. Evaluator-Optimaliserer Mønster

**Kategori:** Agent-orkestrering
**Når bruke:** Iterativ forbedring — én LLM genererer, en annen kritiserer i en løkke til kvaliteten er god nok.

**Prompt-mal:**
```
# Mønster: Generator + Evaluator i løkke

Steg 1 — Generator (Sonnet):
"Skriv en implementering av [funksjon]."

Steg 2 — Evaluator (Opus):
"Evaluer denne implementeringen mot disse kriteriene:
 - Korrekthet, Edge cases, Ytelse, Lesbarhet
 Gi en score 1-10 og konkrete forbedringsforslag."

Steg 3 — Tilbake til Generator:
"Forbedre implementeringen basert på denne tilbakemeldingen:
 {{EVALUATOR_OUTPUT}}"

Gjenta til evaluator gir score ≥ 8.
```

**Hvorfor det fungerer:** Separerer generering fra kritikk. Evaluatoren er ikke biased mot sin egen kode. Løkken konvergerer mot høyere kvalitet enn enkeltpass.

**Fallgruver:**
- Uendelig løkke uten konvergenskriterium — sett maks iterasjoner
- Evaluator som er for streng eller for mild — kalibrer scoring

**Kilde:** [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) | Anthropic Research

---

### 35. Ruting-Mønster (Input-Klassifisering)

**Kategori:** Grunnleggende prompt-teknikk
**Når bruke:** Når ulike typer input krever fundamentalt forskjellige behandlinger — klassifiser først, rut deretter.

**Prompt-mal:**
```
# Første steg — Klassifisering:
"Klassifiser denne henvendelsen i én av kategoriene:
 A) Bug-rapport → rut til debugging-agent
 B) Ny funksjon → rut til planleggings-agent
 C) Refaktorering → rut til arkitektur-agent
 D) Spørsmål → svar direkte

 Henvendelse: {{INPUT}}"

# Andre steg — Spesialisert behandling:
# Hver rute har sin egen optimaliserte prompt og verktøysett
```

**Hvorfor det fungerer:** Spesialiserte prompter for hver inputtype gir bedre resultater enn én generisk prompt. Reduserer feil fra feil-klassifisert input.

**Fallgruver:**
- For mange ruter — øker kompleksitet uten gevinst for enkle systemer
- Dårlige klassifiseringskriterier — input havner i feil rute

**Kilde:** [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) | Anthropic Research

---

### 36. Slash Commands & Skills

**Kategori:** Claude Code-arbeidsflyt
**Når bruke:** Gjentakende arbeidsflyter som bør standardiseres — PR-oppretting, deploy, code review, issue-fiksing.

**Prompt-mal:**
```markdown
# Prosjekt-kommando (.claude/commands/fix-issue.md):
Fiks GitHub-issue: $ARGUMENTS
1. Bruk `gh issue view` for detaljer
2. Søk i kodebasen etter relevante filer
3. Implementer nødvendige endringer
4. Skriv og kjør tester
5. Opprett commit og PR

# Skill med side-effekt-beskyttelse (.claude/skills/deploy/SKILL.md):
---
name: deploy-staging
description: Deploy til staging-miljø
disable-model-invocation: true
---
Deploy til staging: $ARGUMENTS
1. Kjør !git status for å verifisere ren tilstand
2. Kjør !npm run build && npm test
3. Kjør !npm run deploy:staging

# Bruk:
/fix-issue 1234
/deploy-staging v2.1
```

**Hvorfor det fungerer:** Slash commands reduserer eksplisitt prompting. Boris Cherny bruker `/commit-push-pr` "dusinvis av ganger daglig." `disable-model-invocation: true` forhindrer utilsiktet autonom utløsning.

**Fallgruver:**
- Ikke bruke `disable-model-invocation` for workflows med side-effekter
- For komplekse kommandoer i én fil — bryt opp i skills med separate steg

**Kilde:** [Claude Code — Slash Commands](https://code.claude.com/docs/en/slash-commands) | Anthropic + [Boris Cherny](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/) | Boris Cherny

---

### 37. Poka-Yoke Verktøydesign

**Kategori:** Verifikasjon & kvalitet
**Når bruke:** Når du designer verktøy/agenter — gjør det umulig å bruke dem feil (feilsikring).

**Prompt-mal:**
```
# Poka-yoke prinsipper for verktøydesign:

1. Krev absolutte filstier — aldri relative
   Riktig: file_path="/home/user/project/src/auth.ts"
   Feil:   file_path="src/auth.ts"

2. Hold formater nær naturlig internett-tekst
   (lettere for LLM å generere korrekt)

3. Inkluder eksempelbruk og edge cases i verktøydocs:
   "Eksempel: search(query='login bug', path='/src')"

4. Minimalt overlapp mellom verktøy:
   Hvis en menneskelig ingeniør ikke kan si definitivt
   hvilket verktøy å bruke, kan agenten det heller ikke.

5. Returner token-effektiv informasjon
```

**Hvorfor det fungerer:** Verktøyspesifikasjoner fortjener "like mye prompt engineering-oppmerksomhet som dine overordnede prompter." Feilsikre verktøy reduserer beslutningskompleksitet og forhindrer token-sløsing.

**Fallgruver:**
- Overlappende verktøy som skaper tvetydige beslutningspunkter
- Hardkode kompleks if-else logikk i stedet for tydelige verktøygrenser

**Kilde:** [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) | Anthropic Research

---

### 38. Dokument & Tøm-Metoden

**Kategori:** Context engineering
**Når bruke:** Midt i en lang sesjon — dump fremgang til fil, tøm kontekst, gjenoppta fra dokumentasjon.

**Prompt-mal:**
```
# Shrivu Shankars "Document & Clear"-metode:

Steg 1: Dump gjeldende tilstand til .md-fil:
"Oppsummer alt vi har gjort og besluttet i PROGRESS.md.
 Inkluder: endrede filer, beslutninger, gjenstående arbeid,
 og mislykkede tilnærminger."

Steg 2: /clear

Steg 3: Gjenoppta med ren kontekst:
"Les PROGRESS.md og fortsett der vi slapp.
 Neste oppgave er [X]."

# Unngå auto-kompaktering (/compact) som anti-mønster —
# den kan miste subtil kontekst. Manuell dump er tryggere.
```

**Hvorfor det fungerer:** Manuell dump gir full kontroll over hva som bevares. Ren kontekst etter /clear gir Claude maksimal oppmerksomhet for neste oppgave.

**Fallgruver:**
- Stole på auto-kompaktering i stedet — kan miste viktig kontekst
- Dump som er for kort — mister nyanser som trengs for fortsettelse

**Kilde:** [Shrivu Shankar — Every Feature](https://blog.sshh.io/p/how-i-use-every-claude-code-feature) | Shrivu Shankar

---

### 39. ContextKit Faseplanlegging

**Kategori:** Claude Code-arbeidsflyt
**Når bruke:** Strukturert 4-fase planlegging for større funksjoner med tydelig progresjon fra forretning til implementering.

**Prompt-mal:**
```
# Fire faser med dedikerte kommandoer:

Fase 1 — /ctxk:plan:1-spec
→ Brukerhistorier, akseptansekriterier, omfangsgrenser

Fase 2 — /ctxk:plan:2-research-tech
→ Teknologivalg, mønstre, tilgjengelighet, lokalisering

Fase 3 — /ctxk:plan:3-steps
→ Oppgaver S001-S999 med:
  - Parallell-kjøringsmarkører
  - Avhengighetskjeder
  - Estimert kompleksitet

Fase 4 — /ctxk:impl:start-working
→ Kjøring med autonome kvalitetsagenter:
  build-project, run-test-suite, check-accessibility

# Statuslinje med visuell fremdriftsbar for kontekstbruk
```

**Hvorfor det fungerer:** S001-S999 nummerering gir presis oppgavereferanse. Innebygde kvalitetssubagenter verifiserer automatisk. Visuell kontekstmonitor forhindrer overraskende kompaktering.

**Fallgruver:**
- For mye overhead for små endringer — bruk enklere Plan Mode i stedet
- Ikke tilpasse kvalitetsagentene til prosjektets behov

**Kilde:** [FlineDev/ContextKit](https://github.com/FlineDev/ContextKit) | FlineDev

---

### 40. Superpowers TDD-Arbeidsflyt

**Kategori:** Claude Code-arbeidsflyt
**Når bruke:** Kvalitetskritisk utvikling med streng RED-GREEN-REFACTOR syklus og sokratisk brainstorming.

**Prompt-mal:**
```
# Sju-stegs arbeidsflyt:

/superpowers:brainstorm
→ Sokratisk raffinering gjennom spørsmål FØR design

/superpowers:write-plan
→ Dekomponering til 2-5 minutters oppgaver med eksakt spesifikasjon

/superpowers:execute-plan
→ Subagent-drevet med to-stegs review:
  1. Spec-overholdelse (gjør den det den skal?)
  2. Kodekvalitet (er den godt skrevet?)

# TDD er obligatorisk:
# RED: Skriv feilende test først
# GREEN: Minste kode for å bestå
# REFACTOR: Forbedre uten å bryte tester

# Feilsøking: 4-fase med rotårsak-sporing
# og forsvar-i-dybden
```

**Hvorfor det fungerer:** Sokratisk brainstorming avdekker problemer før design. TDD-syklusen sikrer at koden er testbar fra start. To-stegs review fanger både funksjonelle og kvalitetsproblemer.

**Fallgruver:**
- For rigid for utforskende/prototyping-arbeid
- TDD-overhead på kode som skal kastes

**Kilde:** [obra/superpowers](https://github.com/obra/superpowers) | Jesse Vincent

---

### 41. Anti-Drift Konfigurasjon

**Kategori:** Agent-orkestrering
**Når bruke:** Multi-agent systemer der agenter risikerer å avvike fra opprinnelige mål over tid.

**Prompt-mal:**
```
# Anti-drift konfigurasjon:

1. Hierarkisk topologi med maks 6-8 agenter
2. Spesialiserte roller (ikke generiske "helper"-agenter)
3. Hyppig sjekkpunkt-validering:
   "Etter hvert steg, verifiser at du fortsatt jobber
    mot det opprinnelige målet: [MÅL]"
4. Definert scope per agent — ikke la agenter
   utvide eget ansvarsområde
5. Eksplisitte avslutningskriterier:
   "Stopp når [spesifikt kriterium] er oppfylt.
    Ikke fortsett med 'forbedringer'."

# I CLAUDE.md:
"Agenter skal ALDRI utvide scope utover oppgaven.
 Ved tvil, spør leder i stedet for å gjette."
```

**Hvorfor det fungerer:** Uten anti-drift-regler divergerer agenter fra mål gradvis. Sjekkpunkt-validering oppdager drift tidlig. Scope-begrensning forhindrer uønsket utvidelse.

**Fallgruver:**
- For streng kontroll som hindrer agentene i å løse uventede problemer
- For mange sjekkpunkter som øker latens og kostnad

**Kilde:** [ruvnet/claude-flow](https://github.com/ruvnet/claude-flow) | ruvnet

---

### 42. Hook-Basert Prompt-Forbedring

**Kategori:** Avansert / eksperimentelt
**Når bruke:** Automatisk berike vage prompter før Claude behandler dem — fanger opp undersspesifiserte forespørsler.

**Prompt-mal:**
```json
// UserPromptSubmit hook som forbedrer vage prompter:
{
  "hooks": {
    "UserPromptSubmit": [{
      "type": "command",
      "command": "python evaluate_prompt_clarity.py"
    }]
  }
}

// To-stegs arkitektur:
// 1. Hook-nivå evaluering (~189 tokens):
//    Er prompten klar eller vag?
// 2. Kun for vage prompter:
//    → Opprett forskningsplan
//    → Samle kontekst
//    → Still 1-6 målrettede spørsmål

// Bypass-prefikser:
// * = hopp over evaluering
// / = slash-kommando (ignorer)
// # = memoriseringsmodus
```

**Hvorfor det fungerer:** Fanger opp vage prompter automatisk og beriker dem med kontekst. Klare prompter passerer med minimal overhead (~189 tokens). 31% token-reduksjon vs. uten forbedring.

**Fallgruver:**
- For aggressiv forbedring som endrer brukerens intensjon
- Ikke implementere bypass for når du VIL sende en vag prompt

**Kilde:** [severity1/claude-code-prompt-improver](https://github.com/severity1/claude-code-prompt-improver) | severity1

---

### 43. LLM-som-Dommer Kvalitetsporter

**Kategori:** Verifikasjon & kvalitet
**Når bruke:** Kvalitetskontroll av agent-output — evidensbasert scoring med forhåndsdefinerte rubrikker.

**Prompt-mal:**
```
# Kvalitetsport med LLM-evaluering:

"Evaluer denne implementeringen med rubrikken under.
 Gi score 1-5 per kriterium. BLOKKER hvis noen er under 3.

 Rubrikk:
 1. Korrekthet — Oppfyller alle akseptansekriterier?
 2. Edge cases — Håndterer grensetilfeller?
 3. Testdekning — Har meningsfulle tester?
 4. Sikkerhet — Ingen injeksjon/XSS/OWASP top 10?
 5. Lesbarhet — Følger prosjektets kodestil?

 Output: <scores>...</scores> og <verdict>PASS/BLOCK</verdict>
 Hvis BLOCK: <fixes_required>...</fixes_required>"

# Multi-agent voting for kritiske beslutninger:
# 3 uavhengige evaluatorer → majoritetsbeslutning
```

**Hvorfor det fungerer:** Eliminerer ikke-fungerende løsninger FØR de når sluttoutput. Forhåndsdefinerte rubrikker forhindrer subjektiv evaluering. Multi-agent voting reduserer feil.

**Fallgruver:**
- Rubrikker som er for generiske — tilpass til prosjektets spesifikke krav
- Stole blindt på LLM-evaluering uten menneskelig spot-sjekk

**Kilde:** [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit) | NeoLab HQ

---

### 44. Forklar Først, Valider Etterpå

**Kategori:** Context engineering
**Når bruke:** Onboarding til eksisterende kodebase eller planlegging av ny funksjon — inverter den typiske interaksjonsmodellen.

**Prompt-mal:**
```
# I stedet for "Forklar hvordan auth fungerer":
"Slik forstår jeg autentiseringssystemet vårt:
 1. Bruker sender credentials til /api/auth/login
 2. Server validerer mot Supabase
 3. JWT returneres med 1t utløp
 4. Refresh token i httpOnly cookie

 Valider denne forståelsen mot den faktiske kodebasen.
 Korriger eventuelle feil og fyll inn hull."

# Dokumenter konsensus i fokusert fil:
"Skriv den verifiserte forståelsen til AUTH_CONTEXT.md"

# Referer senere med @AUTH_CONTEXT.md
```

**Hvorfor det fungerer:** Å forklare selv først og be Claude validere produserer dramatisk bedre delt kontekst enn "forklar dette til meg." Du tvinger deg selv til å artikulere forståelsen, og Claude korrigerer med presisjon.

**Fallgruver:**
- Forklare noe du ikke forstår i det hele tatt — da er "forklar til meg" bedre
- Ikke dokumentere den validerte forståelsen — mister den ved neste sesjon

**Kilde:** [Alabe Duarte — Context Engineering](https://alabeduarte.com/context-engineering-with-claude-code-my-evolving-workflow/) | Alabe Duarte + [Thomas Landgraf](https://thomaslandgraf.substack.com/p/context-engineering-for-claude-code) | Thomas Landgraf

---

### 45. Kontekst-Rot Forebygging (MAKER)

**Kategori:** Context engineering
**Når bruke:** Langvarige agent-oppgaver der ytelse degraderes over tid — forhindr kontekst-rot.

**Prompt-mal:**
```
# MAKER-mønsteret (fra "Solving a Million-Step
# LLM Task with Zero Errors"):

1. Clean-State Launches:
   Start ferske sub-agenter for hver større oppgave.
   Aldri gjenbruk en sub-agent med forurenset kontekst.

2. Filesystem Memory:
   Bruk filer som delt hukommelse mellom agenter.
   Agenter leser/skriver til felles markdown-filer.

3. Multi-Agent Voting:
   For kritiske beslutninger — 3 uavhengige agenter
   evaluerer → majoritetsbeslutning vinner.

# I CLAUDE.md:
"Når en sub-agent nærmer seg 50% kontekstbruk,
 avslutt den og start en fersk agent med oppgavefilen."
```

**Hvorfor det fungerer:** Kontekst-rot er degradering av LLM-ytelse ettersom kontekst akkumuleres. Ferske sub-agenter med isolert kontekst eliminerer problemet. Filsystem-hukommelse overlever agentens livssyklus.

**Fallgruver:**
- For hyppig agent-restart som mister nyttig løpende kontekst
- Filsystem-hukommelse som vokser ukontrollert

**Kilde:** [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit) | NeoLab HQ

---

### 46. Multi-Agent Observability

**Kategori:** Agent-orkestrering
**Når bruke:** Debugging og overvåking av agent-team i sanntid — dashbord for alle hook-hendelser.

**Prompt-mal:**
```json
// Konfigurer alle 12 hooks til å sende hendelser:
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "uv run .claude/hooks/send_event.py --event-type PreToolUse"
      }]
    }],
    "PostToolUse": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "uv run .claude/hooks/send_event.py --event-type PostToolUse"
      }]
    }]
  }
}

// Dataflyt:
// Claude-agenter → Hook-scripts → HTTP POST →
// Bun Server → SQLite → WebSocket → Vue Dashboard

// Dashboard viser:
// Chat-transkript, sesjonsfarget pulsdiagram,
// multi-kriterie filtrering, kostnadsovervåking
```

**Hvorfor det fungerer:** Uten observability er multi-agent systemer en svart boks. Sanntids-dashbord avdekker problemer mens de skjer — ikke etter at de har forårsaket skade.

**Fallgruver:**
- Overhead fra logging kan påvirke agent-ytelse
- For mye data uten filtrering — dashboardet blir ubrukelig

**Kilde:** [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | Disler (Peter Disler)

---

### 47. Prompt-Caching Optimalisering

**Kategori:** Kostnad & ytelse
**Når bruke:** Alltid — CLAUDE.md og systemprompt caches automatisk. Forstå mekanismen for å utnytte den.

**Prompt-mal:**
```
# Automatisk caching:
# CLAUDE.md og systemprompt caches etter første forespørsel.
# Cachet innhold koster 10% av originalpris.

# Strategi:
1. Plasser stabil kontekst i CLAUDE.md (caches)
2. Plasser variabel kontekst i brukermelding (ikke cachet)
3. Bruk Batch API for 50% rabatt på store jobber

# Kostnadssjekk:
/cost → Øyeblikkelig tilbakemelding

# Skills laster on-demand (token-effektive)
# CLAUDE.md laster ALLTID (plasser kun essensielt innhold)

# Gjennomsnitt: $6/dag, 90% av brukere under $12/dag
```

**Hvorfor det fungerer:** Caching-mekanismen belønner stabil kontekst i CLAUDE.md. Å forstå hva som caches vs. ikke lar deg strukturere informasjon for minimal kostnad.

**Fallgruver:**
- Legge variabel informasjon i CLAUDE.md — ugyldiggjør cache hyppig
- Ignorere /cost — uventede kostnader akkumuleres

**Kilde:** [Claude Code — Costs](https://code.claude.com/docs/en/costs) | Anthropic + [Steve Kinney](https://stevekinney.com/courses/ai-development/cost-management) | Steve Kinney

---

### 48. Sesjonslogg-Gjenoppretting

**Kategori:** Avansert / eksperimentelt
**Når bruke:** Når du har mistet kode eller kontekst — gjenopprett fra Claude Codes samtalelogger.

**Prompt-mal:**
```bash
# Samtaler lagres som JSONL-filer:
~/.claude/projects/[prosjekt-hash]/[session-id].jsonl

# Gjenoppta siste sesjon:
claude --continue

# Velg blant nylige sesjoner:
claude --resume

# Navngi sesjoner for enkel gjenfinning:
/rename oauth-migrering

# Gjenoppretting av mistet kode:
# 1. Åpne relevant JSONL-fil
# 2. Søk etter kodeblokker i assistentmeldinger
# 3. Ekstraher implementasjonen

# Proaktivt: Behandle sesjoner som branches.
# Ulike arbeidsstrømmer = separate, persistente kontekster.
```

**Hvorfor det fungerer:** JSONL-logger inneholder hele samtalehistorikken inkludert all kode Claude produserte. Fungerer som "utviklingshukommelsessystem" for gjenoppretting av tapt arbeid.

**Fallgruver:**
- JSONL-filer kan bli store — søk kan være tregt
- Ikke en erstatning for git — kun for nødgjenoppretting

**Kilde:** [Simon Willison](https://simonwillison.net/) | Simon Willison + [YK — Claude Code Tips](https://github.com/ykdojo/claude-code-tips) | YK (ykdojo)

---

## Top 10 jeg bør adoptere først (for en seriøs bygger)

| # | Skill Card | Begrunnelse |
|---|-----------|-------------|
| 1 | **14. Plan Mode Først** | Mest anbefalt praksis på tvers av alle kilder — anbefalt av Claude Code-skaperen selv. |
| 2 | **25. Selv-Verifikasjon** | "Det ene med høyest utbytte" ifølge offisiell dokumentasjon — lukker tilbakemeldingsløkken automatisk. |
| 3 | **18. CLAUDE.md — Presis Kontekst** | Grunnmuren for alle sesjoner — persistent kontekst som eliminerer gjentatte forklaringer. |
| 4 | **29. Aggressiv Konteksthåndtering** | `/clear` mellom oppgaver er den enkleste måten å forbedre resultatkvalitet umiddelbart. |
| 5 | **2. XML-Tag Strukturering** | Fundamentalt for alle komplekse prompter — separerer data, instruksjoner og output pålitelig. |
| 6 | **21. Sub-Agent Delegering** | Holder hovedkonteksten ren og muliggjør parallell utforskning — essensiell for store kodebaser. |
| 7 | **26. Hooks for Determinisme** | Garanterer at formatering/linting/sikkerhet skjer — i motsetning til CLAUDE.md som er rådgivende. |
| 8 | **12. HANDOFF.md Sesjon-Kontinuitet** | Løser kontekst-amnesi som er den største produktivitetsdreperen i langvarige prosjekter. |
| 9 | **28. Tre-Lags Modellruting** | Optimaliserer kostnad uten å ofre kvalitet — Opus/Sonnet/Haiku etter oppgavetype. |
| 10 | **15. Intervju-Mønsteret** | Oppdager ukjente krav og edge cases FØR implementering — produserer bedre specs. |

---

## Bidragsytere analysert (55+)

Anthropic (docs team), Boris Cherny, Adam Wolff, Shrivu Shankar, Steve Sewell, Addy Osmani, Alex Op, HumanLayer team, YK (ykdojo), Alabe Duarte, Christian B. B. Houmann, Simon Willison, Paul Ford, DreamHost team, Kieran Klaassen, Will Seltzer, Ilyas Ibrahim, Thomas Landgraf, NeoLab HQ, Florian Bruniaux, DataCamp team, Armin Ronacher, Disler (Peter Disler), UndeadList, VoltAgent team, lst97, wshobson, Piebald-AI, hesreallyhim, russbeye, hudrazine, yuvalsuede, Sonovore, parcadei, zebbern, Kuntal, Brent W. Peterson, Sankalp, Steve Kinney, Stéphane Derosiaux, Cole Medin, centminmod, McKay Wrigley, Jesse Vincent (obra), ruvnet, severity1, FlineDev, SireJeff, Murat Can Koylan, Eyal Toledano, Comfy-Org, samihalawa, Rohit Ghumare, scpedicini, Chris Wiles, nwiizo.

---

## Kilder (hovedlenker)

**Anthropic offisiell:**
- [Anthropic — Prompt Engineering Docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic — Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [Claude Code — Best Practices](https://code.claude.com/docs/en/best-practices)
- [Claude Code — Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
- [Claude Code — Sub-agents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code — Memory](https://code.claude.com/docs/en/memory)
- [Claude Code — Slash Commands](https://code.claude.com/docs/en/slash-commands)
- [Claude Code — Costs](https://code.claude.com/docs/en/costs)

**Blogposter & artikler:**
- [Boris Cherny Workflow (InfoQ)](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/)
- [Shrivu Shankar — Every Feature](https://blog.sshh.io/p/how-i-use-every-claude-code-feature)
- [Steve Sewell — Builder.io](https://www.builder.io/blog/claude-code)
- [Addy Osmani — Agent Teams](https://addyosmani.com/blog/claude-code-agent-teams/)
- [Alex Op — Tasks to Swarms](https://alexop.dev/posts/from-tasks-to-swarms-agent-teams-in-claude-code/)
- [HumanLayer — Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Alabe Duarte — Context Engineering](https://alabeduarte.com/context-engineering-with-claude-code-my-evolving-workflow/)
- [Thomas Landgraf — Context Engineering Deep Knowledge](https://thomaslandgraf.substack.com/p/context-engineering-for-claude-code)
- [Simon Willison](https://simonwillison.net/)
- [Steve Kinney — Cost Management](https://stevekinney.com/courses/ai-development/cost-management)

**GitHub-repoer:**
- [coleam00/context-engineering-intro](https://github.com/coleam00/context-engineering-intro)
- [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit)
- [FlineDev/ContextKit](https://github.com/FlineDev/ContextKit)
- [obra/superpowers](https://github.com/obra/superpowers)
- [ruvnet/claude-flow](https://github.com/ruvnet/claude-flow)
- [wshobson/agents](https://github.com/wshobson/agents)
- [undeadlist/claude-code-agents](https://github.com/undeadlist/claude-code-agents)
- [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)
- [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability)
- [mckaywrigley/prompts](https://github.com/mckaywrigley/prompts)
- [severity1/claude-code-prompt-improver](https://github.com/severity1/claude-code-prompt-improver)
- [centminmod/my-claude-code-setup](https://github.com/centminmod/my-claude-code-setup)
- [russbeye/claude-memory-bank](https://github.com/russbeye/claude-memory-bank)
- [willseltzer/claude-handoff](https://github.com/willseltzer/claude-handoff)
- [YK — Claude Code Tips](https://github.com/ykdojo/claude-code-tips)
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts)
- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
- [Kieran Klaassen — Swarm Orchestration Gist](https://gist.github.com/kieranklaassen/4f2aba89594a4aea4ad64d753984b2ea)
