# Task List - Web App Collaborativa Task Management

- [x] Setup iniziale del progetto standalone
- [x] Definizione del Design System in Vanilla CSS (`styles.css`) con tema scuro glassmorphic ed HSL tokens
- [x] Definizione dei modelli dati, stato iniziale e gestore della concorrenza (`js/data.js`)
- [x] Implementazione del motore di Auto-Assegnazione e Workload ($W_u$) (`js/workloadEngine.js`)
- [x] Implementazione del simulatore WebSocket & NATS Event Bus (`js/realtimeSimulator.js`)
- [x] Implementazione dell'engine di Export dati JSON/CSV (`js/exportEngine.js`)
- [x] Realizzazione dei componenti UI (`index.html` & `js/app.js`):
  - [x] Navbar con selettore utente attivo, status WebSocket (Ping/Pong) e toggle riconnessione
  - [x] Tabellone Kanban interattivo con transizioni di stato e Lock Ottimistico (`version`)
  - [x] Pannello Carico di Lavoro Team con meter progressivi e calcolatore euristico
  - [x] Modale di Risoluzione Conflitti (Simulazione HTTP 409 Conflict)
  - [x] Dashboard delle Metriche (Grafana/Prometheus mock con SLA Uptime 99.85%)
  - [x] Modale ed Azione di Export Dati JSON & CSV
- [x] Verifica funzionale e completamento dell'applicazione
