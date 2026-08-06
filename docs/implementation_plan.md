# Implementation Plan - Web App Collaborativa di Gestione Task

Costruzione di una web application SPA in React (Vite + TypeScript + Vanilla CSS avanzato) che implementa il prototipo completo e interattivo della piattaforma di gestione task descritta nell'architettura.

## User Review Required

> [!IMPORTANT]
> L'applicazione verrà creata nella cartella: `C:\Users\39349\.gemini\antigravity\scratch\task-management-app`.
> Al termine del setup e sviluppo, consigliamo di impostare tale cartella come workspace principale.

> [!NOTE]
> L'applicazione includerà sia l'interfaccia utente (Kanban Board, Gestione del Carico, Export Dati) sia le simulazioni interattive in tempo reale (Simulatore di connessioni WebSocket/NATS, Algoritmo di Auto-Assegnazione dinamico, e Risoluzione Conflitti da Lock Ottimistico).

---

## Proposed Changes

### [Component 1] Vite + React Application Setup

#### [NEW] [package.json](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/package.json)
#### [NEW] [vite.config.ts](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/vite.config.ts)
#### [NEW] [index.html](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/index.html)

---

### [Component 2] Design System & Styling (Vanilla CSS)

#### [NEW] [src/index.css](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/index.css)
- Design tokens: HSL color palette (Sleek Dark Mode, neon blue/purple accents, status badges, glassmorphism containers).
- Dynamic micro-animations (card hovers, status pulses, toast notifications, connection indicators).
- Typography via Google Fonts (Inter & Outfit).

---

### [Component 3] Core State, Mock Services & Simulation Engines

#### [NEW] [src/types/index.ts](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/types/index.ts)
- Interfacce per `Task`, `User`, `WorkloadMetrics`, `Notification`, `EventLog`, `ConflictState`.

#### [NEW] [src/services/workloadEngine.ts](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/services/workloadEngine.ts)
- Algoritmo euristico di calcolo del carico $W_u$ ed elezione del membro del team per l'assegnazione automatica.

#### [NEW] [src/services/realtimeSimulator.ts](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/services/realtimeSimulator.ts)
- Simulatore WebSocket Hub e Bus di eventi NATS con gestione reconnect, ping/pong e simulazione race condition.

#### [NEW] [src/services/exportEngine.ts](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/services/exportEngine.ts)
- Generatore di download per file JSON e CSV formattati.

---

### [Component 4] User Interface & Views

#### [NEW] [src/components/Navbar.tsx](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/components/Navbar.tsx)
- Bar superiore con indicatore WebSocket in tempo reale, selettore utente attivo (Alice/Bob/Charlie), e pulsanti di azione rapida.

#### [NEW] [src/components/KanbanBoard.tsx](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/components/KanbanBoard.tsx)
- Tabellone interattivo colonne (TODO, IN_PROGRESS, IN_REVIEW, DONE) con drag & drop / status picker e badge di versione per il lock ottimistico.

#### [NEW] [src/components/WorkloadPanel.tsx](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/components/WorkloadPanel.tsx)
- Visualizzazione del carico di ciascun membro del team in tempo reale e pulsante "Auto-Assign New Task".

#### [NEW] [src/components/ConflictModal.tsx](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/components/ConflictModal.tsx)
- Interfaccia di risoluzione conflitti (HTTP 409 Simulation) quando due utenti modificano lo stesso task simultaneamente.

#### [NEW] [src/components/ExportModal.tsx](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/components/ExportModal.tsx)
- Modale per selezionare filtri ed esportare i dati in JSON/CSV.

#### [NEW] [src/components/MetricsDashboard.tsx](file:///C:/Users/39349/.gemini/antigravity/scratch/task-management-app/src/components/MetricsDashboard.tsx)
- Pannello di monitoraggio stile Prometheus/Grafana (Throughput API, connessioni WS attive, SLA Uptime 99.5%).

---

## Verification Plan

### Automated Verification
1. Esecuzione del comando `npm run build` per verificare la correttezza di compilazione TypeScript e bundling Vite.

### Manual Verification
1. **Verifica Tabellone Kanban**: Creazione e spostamento di un task con verifica dell'aggiornamento automatico della colonna e incremento del campo `version`.
2. **Verifica Auto-Assegnazione**: Aggiunta di un nuovo task con opzione "Auto-Assign" e verifica che venga scelto l'utente con il minore carico calcolato $W_u$.
3. **Verifica Gestione Conflitti**: Simulazione di un edit concorrente tra Alice e Bob per testare il modale HTTP 409 Conflict.
4. **Verifica Notifiche e WebSocket**: Cambio di utente e verifica dei toast e log di rete NATS.
5. **Verifica Export**: Download di file JSON e CSV con i dati correnti del progetto.
