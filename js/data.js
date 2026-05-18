// Initial Application State & State Manager
export const STATUSES = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  DONE: 'DONE'
};

export const STATUS_WEIGHTS = {
  [STATUSES.IN_PROGRESS]: 1.0,
  [STATUSES.IN_REVIEW]: 0.5,
  [STATUSES.TODO]: 0.25,
  [STATUSES.DONE]: 0.0
};

export const INITIAL_USERS = [
  { id: 'usr-1', name: 'Alice Rossi', role: 'Backend Dev (Go)', avatar: 'AR', status: 'Available' },
  { id: 'usr-2', name: 'Bob Bianchi', role: 'Frontend Dev (React)', avatar: 'BB', status: 'Available' },
  { id: 'usr-3', name: 'Charlie Verde', role: 'DevOps & Cloud', avatar: 'CV', status: 'Available' },
  { id: 'usr-4', name: 'Diana Neri', role: 'QA Engineer', avatar: 'DN', status: 'Busy' }
];

export const INITIAL_TASKS = [
  {
    id: 'tsk-101',
    title: 'Setup Config OAuth2 Provider in Go',
    description: 'Generazione boilerplate ed errori handler per token PKCE e refresh token rotation in Redis.',
    status: STATUSES.DONE,
    priority: 'HIGH',
    storyPoints: 5,
    assigneeId: 'usr-1',
    creatorId: 'usr-1',
    version: 3,
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'tsk-102',
    title: 'Gestione Race Condition WebSocket e NATS Hub',
    description: 'Implementare RWMutex e buffer idempotente per sconnessioni improvvise ed evitare deadlock.',
    status: STATUSES.IN_PROGRESS,
    priority: 'URGENT',
    storyPoints: 8,
    assigneeId: 'usr-1',
    creatorId: 'usr-2',
    version: 4,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'tsk-103',
    title: 'Disegno Tabellone Kanban & Reconnect Loop',
    description: 'Componente React SPA con exponential backoff auto-reconnect su connessioni WSS instabili.',
    status: STATUSES.IN_REVIEW,
    priority: 'MEDIUM',
    storyPoints: 3,
    assigneeId: 'usr-2',
    creatorId: 'usr-1',
    version: 2,
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'tsk-104',
    title: 'Deploy Terraform Cluster Kubernetes GKE',
    description: 'IaC multi-cloud per ingress Traefik API Gateway, HPA autoscaling e Prometheus/Loki.',
    status: STATUSES.TODO,
    priority: 'HIGH',
    storyPoints: 5,
    assigneeId: 'usr-3',
    creatorId: 'usr-3',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'tsk-105',
    title: 'Engine Export Dati JSON/CSV/Parquet',
    description: 'Streaming HTTP chunked per report analitici su larga scala senza caricamento completo in RAM.',
    status: STATUSES.TODO,
    priority: 'LOW',
    storyPoints: 2,
    assigneeId: null,
    creatorId: 'usr-2',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

class StateManager {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.tasks = [...INITIAL_TASKS];
    this.activeUserId = 'usr-1';
    this.listeners = [];
    this.wsConnected = true;
    this.latencyMs = 18;
    this.eventLogs = [];
  }

  getState() {
    return {
      users: this.users,
      tasks: this.tasks,
      activeUser: this.users.find(u => u.id === this.activeUserId) || this.users[0],
      activeUserId: this.activeUserId,
      wsConnected: this.wsConnected,
      latencyMs: this.latencyMs,
      eventLogs: this.eventLogs
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(l => l(state));
  }

  setActiveUser(userId) {
    this.activeUserId = userId;
    this.notify();
  }

  setWsConnected(connected) {
    this.wsConnected = connected;
    this.notify();
  }

  logEvent(topic, payload) {
    const logItem = {
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString(),
      topic,
      payload
    };
    this.eventLogs.unshift(logItem);
    if (this.eventLogs.length > 50) this.eventLogs.pop();
    this.notify();
  }

  addTask(taskData) {
    const newTask = {
      id: 'tsk-' + Date.now(),
      version: 1,
      updatedAt: new Date().toISOString(),
      ...taskData
    };
    this.tasks.push(newTask);
    this.logEvent('tasks.events.created', { taskId: newTask.id, title: newTask.title });
    this.notify();
    return newTask;
  }

  updateTaskStatus(taskId, newStatus, currentVersion) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Task not found' };

    // Check Optimistic Lock Version Mismatch (HTTP 409 Conflict Simulation)
    if (task.version !== currentVersion) {
      return {
        success: false,
        conflict: true,
        serverTask: { ...task },
        error: `HTTP 409 Conflict: Version mismatch. Expected v${task.version}, client sent v${currentVersion}`
      };
    }

    task.status = newStatus;
    task.version += 1;
    task.updatedAt = new Date().toISOString();

    this.logEvent('tasks.events.updated', {
      taskId: task.id,
      newStatus,
      newVersion: task.version,
      actor: this.activeUserId
    });

    this.notify();
    return { success: true, task };
  }

  updateTaskAssignee(taskId, assigneeId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.assigneeId = assigneeId;
      task.version += 1;
      task.updatedAt = new Date().toISOString();
      this.logEvent('tasks.events.assigned', {
        taskId: task.id,
        assigneeId,
        actor: this.activeUserId
      });
      this.notify();
    }
  }

  forceSimulateConflict(taskId) {
    // Simulates a background edit by another user that bumps the version
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.version += 1;
      task.title += ' [Modificato da un altro utente via WS]';
      task.updatedAt = new Date().toISOString();
      this.logEvent('tasks.events.conflict_triggered', {
        taskId: task.id,
        newVersion: task.version
      });
      this.notify();
    }
  }
}

export const store = new StateManager();
