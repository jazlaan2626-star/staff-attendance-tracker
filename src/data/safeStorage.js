// Wraps localStorage/sessionStorage so a blocked-storage browser (private
// mode, embedded preview frames, strict cookie settings) degrades to
// "nothing persists" instead of throwing and blanking the whole app.
// Even *accessing* window.localStorage can throw a SecurityError in some
// sandboxed/embedded contexts, so every access is wrapped, not just calls.
function makeSafe(getStorage) {
  return {
    get(key) {
      try { return getStorage()?.getItem(key) ?? null; } catch { return null; }
    },
    set(key, value) {
      try { getStorage()?.setItem(key, value); } catch { /* storage unavailable — ignore */ }
    },
    remove(key) {
      try { getStorage()?.removeItem(key); } catch { /* ignore */ }
    },
  };
}

export const safeLocal = makeSafe(() => (typeof window !== 'undefined' ? window.localStorage : null));
export const safeSession = makeSafe(() => (typeof window !== 'undefined' ? window.sessionStorage : null));
