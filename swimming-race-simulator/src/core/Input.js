/**
 * Menyatukan keyboard, klik canvas, dan tombol layar sentuh menjadi aksi:
 * 'stroke' | 'dive' | 'flip' | 'quit' | 'mute' | 'camera'
 */
export class Input {
  constructor({ canvas, buttons, onAction }) {
    this.onAction = onAction;
    this.enabled = false;

    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      const map = {
        Space: 'stroke', Enter: 'dive', KeyD: 'dive', ArrowUp: 'dive',
        KeyF: 'flip', Escape: 'quit', KeyM: 'mute', KeyC: 'camera',
      };
      const action = map[e.code];
      if (!action) return;
      if (!this.enabled && !['mute', 'quit', 'camera'].includes(action)) return;
      e.preventDefault();
      if (e.repeat) return; // menahan tombol tidak dihitung sebagai kayuhan
      this.fire(action);
    });

    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.fire('stroke');
    });

    for (const [action, el] of Object.entries(buttons)) {
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.fire(action);
      });
      // cegah klik keyboard (Spasi/Enter) memicu tombol yang sedang fokus
      el.addEventListener('click', (e) => e.preventDefault());
      el.setAttribute('tabindex', '-1');
    }
  }

  fire(action) {
    if (['mute', 'quit', 'camera'].includes(action) || this.enabled) {
      this.onAction(action, performance.now() / 1000);
    }
  }
}
