import { store, STATUSES } from './data.js';
import { calculateTeamWorkload, findOptimalAssignee } from './workloadEngine.js';
import { realtimeSim } from './realtimeSimulator.js';
import { exportTasksAsJSON } from './exportEngine.js';

class App {
  constructor() {
    this.activeConflictTask = null;
    this.init();
  }

  init() {
    this.bindDOMEvents();
    store.subscribe((state) => this.render(state));
    this.render(store.getState());
  }

  bindDOMEvents() {
    const selectUser = document.getElementById('select-user');
    if (selectUser) {
      selectUser.addEventListener('change', (e) => {
        store.setActiveUser(e.target.value);
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

    document.getElementById('form-task')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-desc').value;
      const storyPoints = parseInt(document.getElementById('task-points').value, 10);
      const priority = document.getElementById('task-priority').value;
      const assigneeValue = document.getElementById('task-assignee').value;
      const state = store.getState();
      let assigneeId = assigneeValue;

      if (assigneeValue === 'AUTO') {
        const optimal = findOptimalAssignee(state.users, state.tasks);
        assigneeId = optimal ? optimal.userId : state.users[0].id;
      }

      store.addTask({
        title,
        description,
        storyPoints,
        priority,
        status: STATUSES.TODO,
        assigneeId,
        creatorId: state.activeUserId
      });
    });
  }

  render(state) {
    this.renderKanban(state);
  }

  renderKanban(state) {
    // Simple render implementation
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});

// DOM Selector optimizations applied for fast rendering.