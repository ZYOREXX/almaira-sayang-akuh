/**
 * Menyatukan keyboard, klik canvas, dan tombol layar sentuh menjadi aksi:
 * 'stroke' | 'dive' | 'flip' | 'quit' | 'mute'
 */
export class Input {
  constructor({ canvas, buttons, onAction }) {
    this.onAction = onAction;
    this.enabled = false;

    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      const map = {
        Space: 'stroke', Enter: 'dive', KeyD: 'dive', ArrowUp: 'dive',
        KeyF: 'flip', Escape: 'quit', KeyM: 'mute',
      };
      const action = map[e.code];
      if (!action) return;
      if (!this.enabled && action !== 'mute' && action !== 'quit') return;
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
    if (action === 'mute' || action === 'quit' || this.enabled) {
      this.onAction(action, performance.now() / 1000);
    }
  }
}
