// Export Engine for Structured Data Export
import { store } from './data.js';

export function exportTasksAsJSON() {
  const state = store.getState();
  const exportPayload = {
    metadata: {
      exportedAt: new Date().toISOString(),
      exportedBy: state.activeUser.name,
      totalTasks: state.tasks.length,
      systemVersion: 'v1.4.2-k8s'
    },
    users: state.users,
    tasks: state.tasks
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  downloadFile(jsonStr, `task_export_${Date.now()}.json`, 'application/json');
}
