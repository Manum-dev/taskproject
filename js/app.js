import { store, STATUSES } from './data.js';
import { realtimeSim } from './realtimeSimulator.js';
import { exportTasksAsJSON, exportTasksAsCSV } from './exportEngine.js';

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeInput(text, maxLength = 255) {
  if (!text) return '';
  const trimmed = text.trim();
  return escapeHTML(trimmed.slice(0, maxLength));
}

class App {
  constructor() {
    this.activeConflictTask = null;
    this.draggedTaskId = null;
    this.draggedTaskVersion = null;
    this.init();
  }

  init() {
    this.bindDOMEvents();
    this.bindGlobalKeyboardEvents();
    this.initDragAndDrop();
    store.subscribe((state) => this.render(state));
    this.render(store.getState());
  }

  bindGlobalKeyboardEvents() {
    // Tasto Escape per chiudere modali attivi
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active');
        });
      }
    });

    // Chiusura cliccando sul backdrop scuro
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }

  initDragAndDrop() {
    // Setup drop target sulle colonne Kanban
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.style.background = 'hsla(217, 91%, 60%, 0.15)';
      });

      col.addEventListener('dragleave', () => {
        col.style.background = '';
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.style.background = '';
        const newStatus = col.dataset.status;

        if (this.draggedTaskId && newStatus) {
          const state = store.getState();
          const task = state.tasks.find(t => t.id === this.draggedTaskId);
          if (task && task.status !== newStatus) {
            this.handleTaskMove(task, newStatus);
          }
        }
      });
    });
  }

  bindDOMEvents() {
    const selectUser = document.getElementById('select-user');
    if (selectUser) {
      selectUser.addEventListener('change', (e) => {
        const userId = sanitizeInput(e.target.value, 50);
        store.setActiveUser(userId);
        realtimeSim.showToast('Utente Attivo Modificato', `Ora stai eseguendo le azioni come ${escapeHTML(e.target.options[e.target.selectedIndex].text)}`);
      });
    }

    document.getElementById('btn-toggle-ws')?.addEventListener('click', () => {
      realtimeSim.toggleConnection();
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetTab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(targetTab)?.classList.add('active');
      });
    });

    const modalTask = document.getElementById('modal-task');
    document.getElementById('btn-new-task')?.addEventListener('click', () => {
      this.populateAssigneeSelect();
      modalTask?.classList.add('active');
    });

    document.getElementById('close-modal-task')?.addEventListener('click', () => modalTask?.classList.remove('active'));
    document.getElementById('cancel-modal-task')?.addEventListener('click', () => modalTask?.classList.remove('active'));

    // Form Submit Task
    document.getElementById('form-task')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const startTime = performance.now();

      const rawTitle = document.getElementById('task-title').value;
      const rawDesc = document.getElementById('task-desc').value;
      const title = sanitizeInput(rawTitle, 120);
      const description = sanitizeInput(rawDesc, 1000);

      if (!title) {
        realtimeSim.showToast('Errore di Validazione', 'Il titolo del task non può essere vuoto.', 'conflict');
        return;
      }

      const pointsInput = parseInt(document.getElementById('task-points').value, 10);
      const storyPoints = [1, 2, 3, 5, 8].includes(pointsInput) ? pointsInput : 3;
      const rawPriority = document.getElementById('task-priority').value;
      const priority = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(rawPriority) ? rawPriority : 'MEDIUM';

      const assigneeValue = sanitizeInput(document.getElementById('task-assignee').value, 50);
      const state = store.getState();
      let assigneeId = assigneeValue;



      const newTask = store.addTask({
        title,
        description,
        storyPoints,
        priority,
        status: STATUSES.TODO,
        assigneeId,
        creatorId: state.activeUserId
      });

      const durationMs = Math.round((performance.now() - startTime) * 100) / 100;
      console.log(`⚡ [METRICA HTTP] Task "${title}" creato in ${durationMs} ms (ID: ${newTask.id})`);
      realtimeSim.showToast('Task Creato con Successo', `Tempo di risposta API: ${durationMs} ms (Versione: v1)`);

      modalTask?.classList.remove('active');
      document.getElementById('form-task').reset();
    });

    // Stress Test Runner Action
    document.getElementById('btn-run-loadtest')?.addEventListener('click', async () => {
      const btn = document.getElementById('btn-run-loadtest');
      const progressContainer = document.getElementById('loadtest-progress-container');
      const progressFill = document.getElementById('loadtest-progress-fill');
      const progressText = document.getElementById('loadtest-percent-text');
      const statusText = document.getElementById('loadtest-status-text');

      if (!btn) return;
      btn.disabled = true;
      btn.textContent = '⏳ Stress Test in corso...';
      if (progressContainer) progressContainer.style.display = 'block';

      const results = await realtimeSim.runStressTest(100, 30, (p) => {
        const pct = Math.round((p.completedBatch / p.totalBatches) * 100);
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressText) progressText.textContent = `${pct}%`;
        if (statusText) statusText.textContent = `Generati ${p.currentRequests} req/sec concorrenti (${p.completedBatch}/${p.totalBatches} cicli)...`;
      });

      btn.disabled = false;
      btn.textContent = '🚀 Avvia Test di Carico (100 Utenti)';

      const metricRps = document.getElementById('metric-rps');
      const metricP95 = document.getElementById('metric-p95');
      const metricWs = document.getElementById('metric-ws-conn');

      if (metricRps) metricRps.textContent = `${results.reqPerSec} rps`;
      if (metricP95) metricP95.textContent = `${results.latencies.p90} ms`;
      if (metricWs) metricWs.textContent = `${results.virtualUsers * 2}`;
    });



    document.getElementById('btn-simulate-conflict')?.addEventListener('click', () => {
      const state = store.getState();
      const inProgressTask = state.tasks.find(t => t.status === STATUSES.IN_PROGRESS) || state.tasks[0];
      if (inProgressTask) {
        store.forceSimulateConflict(inProgressTask.id);
        realtimeSim.showToast('Simulazione Conflitto Triggerata', `Il task "${escapeHTML(inProgressTask.title)}" è stato modificato sul server da un altro utente! Modificalo per vedere la risposta HTTP 409 Conflict.`, 'conflict');
      }
    });

    const modalConflict = document.getElementById('modal-conflict');
    document.getElementById('close-modal-conflict')?.addEventListener('click', () => modalConflict?.classList.remove('active'));
    
    document.getElementById('btn-accept-server')?.addEventListener('click', () => {
      modalConflict?.classList.remove('active');
      this.activeConflictTask = null;
      realtimeSim.showToast('Versione Server Accettata', 'Interfaccia sincronizzata con l\'ultima versione DB.');
    });

    document.getElementById('btn-merge-override')?.addEventListener('click', () => {
      if (this.activeConflictTask) {
        const { taskId, newStatus, serverTask } = this.activeConflictTask;
        store.updateTaskStatus(taskId, newStatus, serverTask.version);
        modalConflict?.classList.remove('active');
        this.activeConflictTask = null;
        realtimeSim.showToast('Merge Eseguito', 'Le tue modifiche sono state applicate con il nuovo numero di versione incrementato.');
      }
    });

    document.getElementById('btn-export-data')?.addEventListener('click', () => {
      exportTasksAsJSON();
    });
  }

  populateAssigneeSelect() {
    const select = document.getElementById('task-assignee');
    if (!select) return;

    const state = store.getState();
    let html = '';
    state.users.forEach(u => {
      html += `<option value="${escapeHTML(u.id)}">${escapeHTML(u.name)} (${escapeHTML(u.role)})</option>`;
    });
    select.innerHTML = html;
  }

  render(state) {
    this.renderUserSelector(state);
    this.renderWsStatus(state);
    this.renderKanban(state);
    this.renderNatsTerminal(state);
  }

  renderUserSelector(state) {
    const select = document.getElementById('select-user');
    if (!select) return;

    if (select.children.length === 0) {
      let html = '';
      state.users.forEach(u => {
        html += `<option value="${escapeHTML(u.id)}" ${u.id === state.activeUserId ? 'selected' : ''}>${escapeHTML(u.name)}</option>`;
      });
      select.innerHTML = html;
    } else {
      select.value = state.activeUserId;
    }
  }

  renderWsStatus(state) {
    const dot = document.getElementById('ws-dot');
    const text = document.getElementById('ws-text');
    if (dot && text) {
      if (state.wsConnected) {
        dot.className = 'status-dot connected';
        text.textContent = `WSS: Connected (${state.latencyMs}ms)`;
      } else {
        dot.className = 'status-dot disconnected';
        text.textContent = 'WSS: Disconnected (Retrying)';
      }
    }
  }

  renderKanban(state) {
    const columns = {
      [STATUSES.TODO]: document.getElementById('list-todo'),
      [STATUSES.IN_PROGRESS]: document.getElementById('list-inprogress'),
      [STATUSES.IN_REVIEW]: document.getElementById('list-review'),
      [STATUSES.DONE]: document.getElementById('list-done')
    };

    const counts = {
      [STATUSES.TODO]: document.getElementById('count-todo'),
      [STATUSES.IN_PROGRESS]: document.getElementById('count-inprogress'),
      [STATUSES.IN_REVIEW]: document.getElementById('count-review'),
      [STATUSES.DONE]: document.getElementById('count-done')
    };

    Object.values(columns).forEach(col => col && (col.innerHTML = ''));

    const columnTaskCounts = {
      [STATUSES.TODO]: 0,
      [STATUSES.IN_PROGRESS]: 0,
      [STATUSES.IN_REVIEW]: 0,
      [STATUSES.DONE]: 0
    };

    state.tasks.forEach(task => {
      columnTaskCounts[task.status] = (columnTaskCounts[task.status] || 0) + 1;
      const col = columns[task.status];
      if (!col) return;

      const assignee = state.users.find(u => u.id === task.assigneeId);
      const card = document.createElement('div');
      card.className = 'task-card';
      card.draggable = true;
      card.dataset.id = escapeHTML(task.id);
      card.dataset.version = task.version;

      card.innerHTML = `
        <div class="task-card-header">
          <div class="task-card-title">${escapeHTML(task.title)}</div>
          <span class="task-version-tag" title="Optimistic Lock Version">v${task.version}</span>
        </div>
        <div class="task-card-desc">${escapeHTML(task.description || '')}</div>
        <div class="task-card-meta">
          <div class="task-assignee">
            <div class="avatar">${escapeHTML(assignee ? assignee.avatar : '?')}</div>
            <span>${escapeHTML(assignee ? assignee.name.split(' ')[0] : 'Unassigned')}</span>
          </div>
          <div class="task-points">⚡ ${task.storyPoints} pts</div>
        </div>
        <div class="task-actions">
          ${task.status !== STATUSES.TODO ? `<button class="btn-icon-sm btn-prev" title="Sposta indietro">←</button>` : ''}
          ${task.status !== STATUSES.DONE ? `<button class="btn-icon-sm btn-next" title="Avanza stato" style="margin-left:auto;">→</button>` : ''}
        </div>
      `;

      // Eventi Drag & Drop sulla card
      card.addEventListener('dragstart', () => {
        this.draggedTaskId = task.id;
        this.draggedTaskVersion = task.version;
        card.classList.add('dragging');
      });

      card.addEventListener('dragend', () => {
        this.draggedTaskId = null;
        this.draggedTaskVersion = null;
        card.classList.remove('dragging');
      });

      card.querySelector('.btn-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevStatus = this.getPreviousStatus(task.status);
        this.handleTaskMove(task, prevStatus);
      });

      card.querySelector('.btn-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextStatus = this.getNextStatus(task.status);
        this.handleTaskMove(task, nextStatus);
      });

      col.appendChild(card);
    });

    Object.keys(counts).forEach(status => {
      if (counts[status]) counts[status].textContent = columnTaskCounts[status] || 0;
    });
  }

  handleTaskMove(task, newStatus) {
    const startTime = performance.now();
    const result = store.updateTaskStatus(task.id, newStatus, task.version);
    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

    if (!result.success && result.conflict) {
      this.activeConflictTask = { taskId: task.id, newStatus, serverTask: result.serverTask };
      
      document.getElementById('conflict-client-ver').textContent = task.version;
      document.getElementById('conflict-client-text').textContent = `Status: ${escapeHTML(task.status)} → ${escapeHTML(newStatus)}`;

      document.getElementById('conflict-server-ver').textContent = result.serverTask.version;
      document.getElementById('conflict-server-text').textContent = `Titolo: ${escapeHTML(result.serverTask.title)} | Status Corrente: ${escapeHTML(result.serverTask.status)}`;

      document.getElementById('modal-conflict')?.classList.add('active');
    } else if (result.success) {
      realtimeSim.showToast('Task Aggiornato', `Stato in ${escapeHTML(newStatus)} in ${durationMs} ms (v${result.task.version})`);
    }
  }

  getNextStatus(status) {
    if (status === STATUSES.TODO) return STATUSES.IN_PROGRESS;
    if (status === STATUSES.IN_PROGRESS) return STATUSES.IN_REVIEW;
    if (status === STATUSES.IN_REVIEW) return STATUSES.DONE;
    return status;
  }

  getPreviousStatus(status) {
    if (status === STATUSES.DONE) return STATUSES.IN_REVIEW;
    if (status === STATUSES.IN_REVIEW) return STATUSES.IN_PROGRESS;
    if (status === STATUSES.IN_PROGRESS) return STATUSES.TODO;
    return status;
  }



  renderNatsTerminal(state) {
    const terminal = document.getElementById('nats-terminal');
    if (!terminal) return;

    let html = '';
    state.eventLogs.forEach(evt => {
      html += `
        <div class="terminal-line">
          <span class="terminal-time">[${escapeHTML(evt.timestamp)}]</span>
          <span class="terminal-topic">${escapeHTML(evt.topic)}</span>
          <span>${escapeHTML(JSON.stringify(evt.payload))}</span>
        </div>
      `;
    });

    terminal.innerHTML = html;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
