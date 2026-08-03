// Unit tests for data.js
import { store } from '../js/data.js';

describe('State Manager Tests', () => {
  test('addTask should increase task list count by 1', () => {
    const initialCount = store.getState().tasks.length;
    store.addTask({ title: 'New Unit Test Task', storyPoints: 3 });
    expect(store.getState().tasks.length).toBe(initialCount + 1);
  });
});
