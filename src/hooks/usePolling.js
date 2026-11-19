import { useEffect, useRef } from 'react';

// Calls `callback` every `delayMs` milliseconds, while the component is on screen.
export default function usePolling(callback, delayMs = 5000, enabled = true) {
  // A "sticky note" that always holds the NEWEST version of the callback
  const latest = useRef(callback);
  useEffect(() => {
    latest.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    let timer;
    let stopped = false;

    async function tick() {
      if (stopped) return;

      // Don't ask while the browser tab is hidden (nobody is looking)
      if (document.visibilityState === 'visible') {
        try {
          await latest.current();
        } catch {
          // a failed poll is not the end of the world, we just try again next time
        }
      }

      // Schedule the NEXT tick only after this one has finished
      if (!stopped) timer = setTimeout(tick, delayMs);
    }

    timer = setTimeout(tick, delayMs);

    // Cleanup: runs when the component leaves the screen (or enabled/delay changes)
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [delayMs, enabled]);
}