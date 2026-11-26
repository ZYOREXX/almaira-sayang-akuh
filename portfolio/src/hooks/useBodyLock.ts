import { useEffect } from 'react';

let locks = 0;

/** Prevents the page behind a dialog from scrolling while it is open. */
export function useBodyLock() {
  useEffect(() => {
    locks += 1;
    document.documentElement.classList.add('is-locked');
    return () => {
      locks -= 1;
      if (locks <= 0) {
        locks = 0;
        document.documentElement.classList.remove('is-locked');
      }
    };
  }, []);
}
