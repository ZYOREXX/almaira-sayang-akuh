/** Event bus kecil untuk memisahkan logika lomba dari efek visual & audio. */
export class EventBus {
  constructor() {
    this.handlers = new Map();
  }

  on(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(fn);
    return () => this.handlers.get(type)?.delete(fn);
  }

  emit(type, payload) {
    this.handlers.get(type)?.forEach((fn) => fn(payload));
  }

  clear() {
    this.handlers.clear();
  }
}
