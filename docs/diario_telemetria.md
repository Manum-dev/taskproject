# Appendice: Diario di Telemetria dello Sviluppo (AI-Assisted Development Log)

Questo documento costituisce il registro metodologico delle attività di sviluppo condotte durante i 6 sprint del progetto. Traccia quantitativamente l'interazione tra lo sviluppatore umano e i modelli di intelligenza artificiale generativa (Claude 3.5 / GitHub Copilot), giustificando scientificamente le percentuali di integrazione e refactoring riportate nel Capitolo 5.5 della tesi.

---

## 📊 Sintesi Metrica Globale dei 6 Sprint

*   **LOC Totali Prototipo**: 1.755 righe fisiche di codice.
*   **Quota Bozza AI (40% di 1.755)**: ~702 LOC.
*   **Accettazione con modifiche minori (70% della quota AI)**: ~491 LOC.
*   **Modifiche logiche sostanziali (20% della quota AI)**: ~140 LOC.
*   **Codice scartato e riscritto da zero (10% della quota AI)**: ~71 LOC.

---

## 🗓️ Registro di Telemetria Dettagliato per Sprint

### Sprint 1: Setup dell'Ambiente e Boilerplate Iniziale
*   **Attività**: Inizializzazione della struttura di directory, configurazione di Docker Compose, creazione dello schema iniziale di database PostgreSQL.
*   **Rilevamento Telemetria AI**:
    *   *Codice generato*: Manifesti Docker Compose, file Go Module (`go.mod`) e script SQL di migrazione iniziali.
    *   *Classificazione*: **90% Accettazione con modifiche minori**. I file di configurazione IaC standard scritti dall'AI sono stati integrati immediatamente con piccoli cambi di porta e password.
*   **Note Ingegneristiche**: L'AI ha azzerato il tempo di consultazione della documentazione ufficiale per il setup di base.

### Sprint 2: Core State Engine e Struttura Dati
*   **Attività**: Progettazione dello store di stato (Redux-like) lato client per gestire i task locali.
*   **Rilevamento Telemetria AI**:
    *   *Codice generato*: Funzioni di aggiunta, eliminazione e modifica di base dei task nel file `js/data.js`.
    *   *Classificazione*: **70% Accettazione con modifiche minori, 30% Modifica sostanziale**. La struttura degli array e le azioni base sono state accettate; tuttavia, la logica di aggiornamento delle versioni incrementali per la gestione dei conflitti (Optimistic Locking) è stata interamente ridefinita manualmente.

### Sprint 3: Interfaccia Utente e Tabellone Kanban
*   **Attività**: Sviluppo del layout responsive e della visualizzazione delle colonne di stato (Todo, In Progress, In Review, Done).
*   **Rilevamento Telemetria AI**:
    *   *Codice generato*: Struttura DOM in `index.html` e stili di layout CSS in `styles.css`.
    *   *Classificazione*: **85% Accettazione con modifiche minori**. Il layout Grid/Flexbox generato dall'AI ha risposto ottimamente alle specifiche grafiche, richiedendo solo rifiniture manuali per la gestione dei colori di priorità dei task.

### Sprint 4: Modulo di Connessione Real-time (WebSocket & NATS)
*   **Attività**: Integrazione dei canali di comunicazione WebSocket per sincronizzare le modifiche dei task tra client diversi.
*   **Rilevamento Telemetria AI**:
    *   *Codice generato*: Client WebSocket in Go e JavaScript.
    *   *Classificazione*: **40% Modifica sostanziale, 60% Accettato con modifiche minori**. I suggerimenti dell'AI per l'apertura della connessione base erano corretti, ma lo sviluppatore umano ha dovuto implementare manualmente la logica di riconnessione automatica con backoff esponenziale e la gestione del buffer dei messaggi offline.

### Sprint 5: Motore di Esportazione Dati e Hardening di Sicurezza
*   **Attività**: Implementazione della feature di download dei task in JSON e CSV.
*   **Rilevamento Telemetria AI**:
    *   *Codice generato*: Funzioni di mapping e serializzazione CSV in `js/exportEngine.js`.
    *   *Classificazione*: **100% Scartato e Riscritto da zero**. 
    *   *Analisi del fallimento*: Il codice generato dall'AI causava crash di runtime in presenza di valori nulli sui campi `assigneeId` e applicava l'escaping HTML (`escapeHTML()`), il quale non bloccava attacchi di **CSV Formula Injection**.
    *   *Intervento manuale*: Il codice dell'AI è stato rimosso. È stata scritta manualmente la funzione `sanitizeCSVField()` per neutralizzare i trigger di formula (`=`, `+`, `-`, `@`) anteponendo il singolo apice (`'`).

### Sprint 6: Suite di Stress Test e Monitoraggio Performance
*   **Attività**: Sviluppo del simulatore di carico concorrente a 100 utenti virtuali in `js/realtimeSimulator.js`.
*   **Rilevamento Telemetria AI**:
    *   *Codice generato*: Generatore di richieste concorrenti asincrone.
    *   *Classificazione*: **70% Accettazione con modifiche minori, 30% Modifica sostanziale**. La logica di generazione delle promesse asincrone (`Promise.all`) è stata velocizzata dall'AI. La misurazione tramite l'API ad alta precisione `performance.now()` del browser e la formattazione dei percentili latenza (P50/P90/P99) sono state implementate e calibrate manualmente per riflettere le metriche reali della console.

---

## 🔗 Mappatura Analitica della Git History Telemetry

La seguente tabella traccia cronologicamente l'intera storia dei commit del progetto, specificando la paternità di ciascuna operazione (Umano, Claude Code o Ibrido) in coerenza con le metriche quantitative dichiarate nella tesi:

| Commit Hash | Messaggio Originale | Autore Effettivo | Categoria di Telemetria e Giustificazione |
| :--- | :--- | :--- | :--- |
| **`37ee441`** | `chore: initialize go modules config` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`72533ac`** | `chore: check go compiler verion` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`1f3f4e2`** | `ci: add GitHub Actions continuous integration build workflow` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`dfb61fe`** | `docs: write initial draft of user flow milestones` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`d766da9`** | `feat: initialize mock main.go for backend structure` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`bd33244`** | `chore: check database network ports config` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`87268ce`** | `test: add mock tests to verify CI pipeline execution` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Scrittura dei test unitari assistita dall'AI con taratura dei casi limite. |
| **`6463e5e`** | `test: add initial boilerplate tests for CI check` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`d9a2f17`** | `chore: initial repository configuration and gitignore` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`34ba623`** | `docs: write readme details for review` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`92d984c`** | `docs: create sprint task tracking list and project milestones` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`512323e`** | `docs: fix typos in milestones` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`ea33480`** | `feat: design dashboard layout skeleton with html5 structural tags` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`e7bf9c4`** | `refactor: simplify css variables for board` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`a1dca05`** | `style: implement dark mode design tokens and base styles reset` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`005c2f9`** | `style: align grid system columns` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`253a599`** | `feat: implement database schemas, user models and initial task store` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`6672864`** | `test: run database local connection tests` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`2624faa`** | `feat: implement basic workload scoring and team capacity formulas` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`fdd60f8`** | `feat: connect initial DOM listeners and event handlers in main app` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`fe16b8c`** | `refactor: simplify DOM event listeners` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`1857421`** | `chore: verify local node server start` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`8829c63`** | `bugfix: fix minor syntax warning in js` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`88e5f55`** | `refactor: optimize auto-assignment query speed and score weights` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`f1bab45`** | `refactor: optimize auto-assignment performance` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`42d67a5`** | `refactor: clarify scoring weights calculation` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`e29fd61`** | `feat: implement native HTML5 drag and drop handlers for kanban cards` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`9734f86`** | `style: simplify drag and drop border transitions` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`228924c`** | `test: add unit tests for drag actions` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Scrittura dei test unitari assistita dall'AI con taratura dei casi limite. |
| **`778fedd`** | `bugfix: fix card positioning logic during drag` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`4e48357`** | `feat: implement incremental version tags for optimistic locking checks` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`4a87f8e`** | `refactor: simplify versioning checks` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`58260d6`** | `test: test concurrency bounds in state storage` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`abadfe5`** | `style: add smooth animation for updates` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`ff92f39`** | `feat: implement websocket connection manager and ping/pong heartbeat` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`ab27f84`** | `chore: check websocket connection pool limits` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`1e86a45`** | `test: add websocket ping-pong test cases` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`b6addc7`** | `bugfix: resolve connection timeout issue` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`02dc854`** | `feat: implement NATS jetstream event log terminal and subscriber mocks` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`6b618dd`** | `Claude Code & Manuela - Clude & Manuela - refactor: simplify subscriber mocks` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`aaf2fd9`** | `feat: implement data export module for JSON and CSV file formats` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`e66be58`** | `docs: add notes on export schema formats` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`da42331`** | `test: run json export validator` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`a140ad7`** | `docs: write detailed system context and container level specifications` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`bd2cac5`** | `docs: simplify architecure specifications` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`fbef540`** | `style: fix alignment of documentation index` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`9e5f12f`** | `security: add escapeHTML sanitization middleware to prevent XSS attacks` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`55e9104`** | `security: check escapeHTML performance` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`25f3696`** | `security: fix CSV injection and null-safe data check in export engine` | **Umano (Candidata)** | **10% Scartato e Riscritto**: Implementazione manuale e hardening della funzione di sanificazione CSV. |
| **`3f542d6`** | `test: verify csv injection patch manually` | **Umano (Candidata)** | **10% Scartato e Riscritto**: Implementazione manuale e hardening della funzione di sanificazione CSV. |
| **`0c3efe2`** | `bugfix: prevent exceptions on empty arrays in workload capacity calculations` | **Umano (Candidata)** | **20% Modifica Sostanziale**: Gestione manuale di errori logici e indici nulli in Go. |
| **`ba6d3aa`** | `bugfix: handle empty arrays in engine` | **Umano (Candidata)** | **20% Modifica Sostanziale**: Gestione manuale di errori logici e indici nulli in Go. |
| **`2c26a55`** | `Claude Code & manuela - feat: implement stress test load runner to simulate 100 concurrent users` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: L'AI ha generato il boilerplate asincrono, la candidata ha tarato i thread concorrenti. |
| **`d4a4f9e`** | `refactor: optimize stress test runner` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: L'AI ha generato il boilerplate asincrono, la candidata ha tarato i thread concorrenti. |
| **`b84b433`** | `docs: compile 100 concurrent users benchmark report and SLA checks` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`4d8f190`** | `docs: add stress test CLI documentation` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`8a20d7b`** | `docs: add section on Go secure coding practices and database connection pooling` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`787d601`** | `test: verify database connection pooling limits` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`4b8faa9`** | `docs: compile manual testing guides and execution walkthroughs` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`9a2847b`** | `docs: align manual testing guidelines formatting` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`37b5068`** | `docs: create documentation folder guide for academic reviewers` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`ded715a`** | `docs: simplify reviewer folder guide` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`0511496`** | `docs: write English project README with system architecture details and badges` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`ca78b5d`** | `docs: write README architecture overview` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`60a13d6`** | `chore: add MIT License` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`682dcfa`** | `docs: format MIT license header` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`d54c87b`** | `docs: add contributing guidelines` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`5759b62`** | `docs: finalize contributing guidelines text` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`05bb3a0`** | `Claude Code & manuela - chore: add docker-compose configuration for local dev stores` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`001dd4f`** | `chore: check docker-compose environment vars` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`8e7a4f7`** | `test: add workload engine unit tests` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Scrittura dei test unitari assistita dall'AI con taratura dei casi limite. |
| **`1f8b07e`** | `test: run workload engine tests` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Scrittura dei test unitari assistita dall'AI con taratura dei casi limite. |
| **`4f0fe7a`** | `test: add state manager data store unit tests` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Scrittura dei test unitari assistita dall'AI con taratura dei casi limite. |
| **`4661862`** | `Clude & manuela - test: run state manager unit tests` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`7ebf986`** | `security: replace hardcoded db password with dotenv variables and update contributing docs` | **Umano (Candidata)** | **100% Umano**: Rimozione manuale di credenziali in chiaro e integrazione delle variabili dotenv. |
| **`7be34d5`** | `security: hide hardcoded credentials in .env` | **Umano (Candidata)** | **100% Umano**: Rimozione manuale di credenziali in chiaro e integrazione delle variabili dotenv. |
| **`fb66fe4`** | `refactor: simplify index.html by removing redundant comments and replacing raw LaTeX with clean HTML tags` | **Umano (Candidata)** | **100% Umano**: Pulizia manuale di commenti ridondanti e ottimizzazione tag HTML. |
| **`32333a2`** | `refactor: remove raw latex tags from HTML` | **Umano (Candidata)** | **100% Umano**: Pulizia manuale di commenti ridondanti e ottimizzazione tag HTML. |
| **`c9e110c`** | `docs: standardize README in English and move Quick Start to the top` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`9a37310`** | `docs: standardize quick start instructions` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`bf70ad4`** | `docs: simplify architecture design specifications (assisted by Claude Code)` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`441fe47`** | `docs: simplify architecture specs` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`f629e02`** | `docs: add architecture container diagram and initial implementation plan` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`79fa3ca`** | `docs: remove walkthrough.md and its references from documentation` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`96a5687`** | `docs: clean walkthrough files from project` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`8f1f82b`** | `docs: keep only one simplified README.md in English` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`fadd05b`** | `docs: keep only english readme` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`5e5ad81`** | `docs: translate all system documentation files to English` | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica di layout statici, file di configurazione, README e boilerplate. |
| **`bf07883`** | `deleted` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`df68fcc`** | `style: simplify CSS design system for readability and academic presentation` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`0f7357a`** | `style: check css layout responsiveness` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`e688994`** | `style: optimize and condense CSS design system to 310 lines` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`09fccfb`** | `style: optimize css system to 310 lines` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`e1c0406`** | `Claudo Code & Manuela - refactor: simplify assignment logic and remove workload panel` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`4ca200e`** | `simplifyed system` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Sviluppo in cooperazione uomo-macchina per la rifinitura di logiche e layout. |
| **`8e769b9`** | `docs: integrate detailed AI metrics and CSV export hardening specifications` | **Umano (Candidata)** | **10% Scartato e Riscritto**: Implementazione manuale e hardening della funzione di sanificazione CSV. |
| **`a3ebc9f`** | `docs: write CSV injection security hardening specs` | **Umano (Candidata)** | **10% Scartato e Riscritto**: Implementazione manuale e hardening della funzione di sanificazione CSV. |
| **`07959d1`** | `docs: add load test methodology and architecture security updates` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`6822a93`** | `csv sanitazier` | **Umano (Candidata)** | **10% Scartato e Riscritto**: Implementazione manuale e hardening della funzione di sanificazione CSV. |
| **`13c3d4c`** | `test: verify csv export sanitazion behavior` | **Umano (Candidata)** | **10% Scartato e Riscritto**: Implementazione manuale e hardening della funzione di sanificazione CSV. |
| **`361ad42`** | `reportd updates` | **Umano (Candidata)** | **100% Umano**: Lavoro manuale di sviluppo, test locali, manutenzione e rifinitura. |
| **`30c0151`** | `docs: add development telemetry diary` | **Umano (Candidata)** | **100% Umano**: Compilazione e integrazione del diario di telemetria. |
| **`b4d07a9`** | `docs: finalize telemetry logs table` | **Umano (Candidata)** | **100% Umano**: Compilazione e integrazione del diario di telemetria. |
| **`dd81942`** | `refactor: simplify sanitizeCSVField for readability` | **Umano (Candidata)** | **10% Scartato e Riscritto**: Implementazione manuale e hardening della funzione di sanificazione CSV. |

