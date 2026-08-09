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
| **`64e6d1b`** | `security: fix CSV injection...` | **Umano (Candidata)** | **10% Scartato e Riscritto**: Rimozione del codice vulnerabile dell'AI e scrittura manuale della patch di sicurezza. |
| **`70d74f3`** | `bugfix: prevent exceptions...` | **Umano (Candidata)** | **20% Modifica Sostanziale**: Correzione manuale di errori logici su indici di array vuoti in Go. |
| **`cb7c85e`** | `feat: implement stress test...` | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: L'AI ha generato il boilerplate asincrono, la candidata ha tarato le metriche di latenza. |
| **`36c42ca`** | `docs: compile 100 VU benchmark...`| **Umano (Candidata)** | **100% Umano**: Report compilato analizzando le reali metriche di latenza lette sulla console. |
| **`742031b`** | `docs: add section on Go secure...`| **Umano (Candidata)** | **100% Umano**: Descrizione delle best practices e del database connection pooling. |
| **`e42b053`** | `docs: compile manual testing...`  | **Ibrido (AI + Umano)** | **70% Boilerplate**: Guida per i test manuali assistita dall'AI per la formattazione. |
| **`1ecb2a1`** | `docs: create doc folder guide...` | **Ibrido (AI + Umano)** | **70% Boilerplate**: Strutturazione delle cartelle di documentazione assistita dall'AI. |
| **`264ac9c`** | `docs: write English project...`   | **Claude Code (AI)** | **70% Boilerplate**: Scrittura del README iniziale e generazione dei badge. |
| **`8131a1e`** | `chore: add MIT License`           | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica della licenza MIT standard. |
| **`f853cb7`** | `docs: add contributing...`        | **Claude Code (AI)** | **70% Boilerplate**: Generazione automatica delle linee guida standard. |
| **`ffeca69`** | `chore: add docker-compose...`     | **Claude Code (AI)** | **70% Boilerplate**: Definizione dei container standard per PostgreSQL/Redis. |
| **`566681d`** | `test: add workload engine...`     | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Generazione dei casi di test da parte dell'AI, rifiniti a mano. |
| **`86f80d7`** | `test: add state manager...`       | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Generazione dei casi di test da parte dell'AI, rifiniti a mano. |
| **`f2dd1c3`** | `security: replace hardcoded...`   | **Umano (Candidata)** | **100% Umano**: Intervento manuale per rimuovere password in chiaro e integrare dotenv. |
| **`1722d41`** | `refactor: simplify index.html...` | **Umano (Candidata)** | **100% Umano**: Rimozione manuale di commenti ridondanti e pulizia tag LaTeX. |
| **`49a8674`** | `docs: standardize README...`      | **Claude Code (AI)** | **70% Boilerplate**: Riorganizzazione automatica del testo in inglese. |
| **`9167172`** | `docs: simplify architecture...`   | **Ibrido (AI + Umano)** | **70% Boilerplate**: Semplificazione delle specifiche (assistito da Claude Code). |
| **`141bcf5`** | `docs: add architecture...`        | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Diagramma C4 disegnato con supporto logico dell'AI. |
| **`2fae434`** | `docs: remove walkthrough.md...`   | **Umano (Candidata)** | **100% Umano**: Manutenzione del repository per la consegna. |
| **`4eb8138`** | `docs: keep only one...`           | **Ibrido (AI + Umano)** | **70% Boilerplate**: Ottimizzazione del README. |
| **`0159ac2`** | `docs: translate all system...`    | **Claude Code (AI)** | **70% Boilerplate**: Traduzione in inglese delle specifiche. |
| **`2ae1db7`** | `deleted`                          | **Umano (Candidata)** | **100% Umano**: Pulizia file temporanei. |
| **`db6371f`** | `style: simplify CSS...`           | **Claude Code (AI)** | **70% Boilerplate**: Semplificazione automatica del CSS di visualizzazione. |
| **`5aed82e`** | `style: optimize and condense...`  | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Ottimizzazione manuale del foglio stile per il responsive. |
| **`50c849f`** | `refactor: simplify assignment...` | **Umano (Candidata)** | **20% Modifica Sostanziale**: Rimozione manuale del pannello di carico. |
| **`226b1dc`** | `simplifyed system`                | **Ibrido (AI + Umano)** | **20% Modifica Sostanziale**: Pulizia e accorpamento manuale di logiche obsolete. |
| **`1f541dc`** | `docs: integrate detailed AI...`   | **Umano (Candidata)** | **100% Umano**: Scrittura del capitolo di hardening e metriche prestazionali. |
| **`d326ce0`** | `docs: add load test...`           | **Umano (Candidata)** | **100% Umano**: Redazione della sezione di sicurezza. |
| **`f6d6d12`** | `csv sanitazier`                   | **Umano (Candidata)** | **10% Scartato e Riscritto**: Implementazione manuale definitiva di `sanitizeCSVField`. |
| **`67c17ba`** | `reportd updates`                  | **Umano (Candidata)** | **100% Umano**: Aggiornamento e calibrazione finale dei log prestazionali. |

