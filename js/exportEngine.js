// Export Engine for Structured Data Export (JSON & CSV Streaming Simulation)
import { store } from './data.js';

export function exportTasksAsJSON() {
  const state = store.getState();
  const exportPayload = {
    metadata: {
      exportedAt: new Date().toISOString(),
      exportedBy: state.activeUser ? state.activeUser.name : 'Sistema',
      totalTasks: state.tasks ? state.tasks.length : 0,
      systemVersion: 'v1.4.2-k8s'
    },
    users: state.users || [],
    tasks: state.tasks || [],
    eventLogs: state.eventLogs || []
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  downloadFile(jsonStr, `task_export_${Date.now()}.json`, 'application/json');
  
  store.logEvent('export.engine.json_generated', {
    taskCount: exportPayload.tasks.length,
    format: 'JSON'
  });
}

export function exportTasksAsCSV() {
  const state = store.getState();
  const headers = ['ID', 'Title', 'Status', 'Priority', 'StoryPoints', 'Assignee', 'Version', 'UpdatedAt'];
  const tasks = Array.isArray(state.tasks) ? state.tasks : [];
  const users = Array.isArray(state.users) ? state.users : [];
  
  const rows = tasks.map(t => {
    const assignee = users.find(u => u.id === t.assigneeId)?.name || null;
    return [
      sanitizeCSVField(t.id),
      sanitizeCSVField(t.title),
      sanitizeCSVField(t.status),
      sanitizeCSVField(t.priority),
      sanitizeCSVField(t.storyPoints),
      sanitizeCSVField(assignee),
      sanitizeCSVField(t.version),
      sanitizeCSVField(t.updatedAt)
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csvContent, `task_export_${Date.now()}.csv`, 'text/csv');

  store.logEvent('export.engine.csv_generated', {
    taskCount: tasks.length,
    format: 'CSV'
  });
}

function sanitizeCSVField(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  str = str.replace(/"/g, '""'); // Escaping dei doppi apici
  if (['=', '+', '-', '@'].some(char => str.startsWith(char))) {
    str = `'` + str; // Neutralizzazione formula injection
  }
  return `"${str}"`;
}

function downloadFile(content, fileName, contentType) {
  try {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Errore durante il download del file:', err);
  }
}

// Logger updates added to export logs for telemetry.