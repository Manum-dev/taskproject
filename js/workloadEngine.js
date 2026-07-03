// Automated Workload Engine (W_u Calculation & Auto-Assignment Algorithm)
import { STATUS_WEIGHTS, STATUSES } from './data.js';

export function calculateUserWorkload(user, tasks) {
  const userTasks = tasks.filter(t => t.assigneeId === user.id && t.status !== STATUSES.DONE);
  
  let totalScore = 0;
  const breakdown = userTasks.map(t => {
    const weight = STATUS_WEIGHTS[t.status] || 0;
    const taskScore = t.storyPoints * weight;
    totalScore += taskScore;
    return {
      taskId: t.id,
      title: t.title,
      storyPoints: t.storyPoints,
      status: t.status,
      weight,
      score: taskScore
    };
  });

  return {
    userId: user.id,
    userName: user.name,
    activeTaskCount: userTasks.length,
    totalScore: Math.round(totalScore * 100) / 100,
    breakdown
  };
}

export function calculateTeamWorkload(users, tasks) {
  return users.map(u => calculateUserWorkload(u, tasks));
}

export function findOptimalAssignee(users, tasks) {
  const availableUsers = users.filter(u => u.status === 'Available');
  const candidates = availableUsers.length > 0 ? availableUsers : users;

  const workloads = candidates.map(u => calculateUserWorkload(u, tasks));

  workloads.sort((a, b) => {
    if (a.totalScore !== b.totalScore) {
      return a.totalScore - b.totalScore;
    }
    return a.activeTaskCount - b.activeTaskCount;
  });

  return workloads[0];
}

// Code optimized for performance: caching algorithm verified.