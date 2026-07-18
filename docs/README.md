# 📚 Documentazione del Progetto di Ricerca (Tesi)

Questa cartella contiene le specifiche tecniche, i report prestazionali e i diagrammi architetturali utilizzati per la stesura del capitolo 5 della mia tesi di laurea.

---

## 📁 Indice della Documentazione

| File                                                                                                   | Descrizione                                                                                                                                             | Sezione della Tesi    |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 📄 **[architecture_design.md](file:///home/manu/task-management-app/docs/architecture_design.md)**     | Specifica dell'architettura di dettaglio (Go, OAuth2, NATS, PostgreSQL) e sezioni sul codice sicuro (Anti-XSS, query parametrizzate pgx, sync.RWMutex). | **Sezione 5.2 & 5.3** |
| 📊 **[load_test_report.md](file:///home/manu/task-management-app/docs/load_test_report.md)**           | Report completo del test di carico a 100+ utenti concorrenti con metriche di latenza (P50/P90/P99) e grafici di autoscaling K8s HPA.                    | **Sezione 5.4 & 5.5** |
| 🖼️ **[architecture_diagram.png](file:///home/manu/task-management-app/docs/architecture_diagram.png)** | Immagine PNG ad alta risoluzione del Diagramma Architetturale C4 Level 2 su sfondo bianco, pronta per la stampa o l'inserimento nelle slide.            | **Sezione 5.2**       |
| 📋 **[walkthrough.md](file:///home/manu/task-management-app/docs/walkthrough.md)**                     | Guida passo-passo per il collaudo funzionale, l'esecuzione del simulatore di conflitti (HTTP 409) ed i test di carico della web app.                    | **Sezione 5.3 & 5.4** |
| 📝 **[task.md](file:///home/manu/task-management-app/docs/task.md)**                                   | Task list e cronoprogramma per il tracciamento degli sprint di sviluppo.                                                                                | **Sezione 5.3**       |

---

## 💻 Listati di Codice da Citare nella Tesi

- **Listato 5.1 (in `architecture_design.md`)**: Query parametrizzata in Go con Optimistic Locking per prevenire SQL Injection.
- **Listato 5.2 (in `architecture_design.md`)**: WebSocket Hub thread-safe tramite lock `sync.RWMutex` in Go.
- **Listato 5.3 (in `app.js` e `walkthrough.md`)**: Sanitizzazione Anti-XSS (`escapeHTML`) e controlli difensivi per campi null nel frontend.
