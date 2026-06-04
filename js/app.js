import { store, STATUSES } from './data.js';

class App {
  constructor() {
    this.draggedTaskId = null;
    this.init();
  }

  init() {
    store.subscribe((state) => this.render(state));
    this.render(store.getState());
  }

  render(state) {
    // Simple render
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
