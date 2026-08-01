// Unit tests for workloadEngine.js
import { calculateUserWorkload, findOptimalAssignee } from '../js/workloadEngine.js';

describe('Workload Engine Tests', () => {
  test('calculateUserWorkload with empty tasks should return 0 score', () => {
    const user = { id: 'usr-1', name: 'Alice' };
    const result = calculateUserWorkload(user, []);
    expect(result.totalScore).toBe(0);
    expect(result.activeTaskCount).toBe(0);
  });
});
