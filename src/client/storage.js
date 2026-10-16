import { storageKeys } from '../config/storage.js';

export function createStorage(getStorage = () => globalThis.localStorage) {
  return {
    get(key) {
      try { return getStorage().getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { getStorage().setItem(key, value); return true; } catch { return false; }
    },
    clearPreferences() {
      try {
        const store = getStorage();
        Object.values(storageKeys).forEach(key => store.removeItem(key));
        return true;
      } catch { return false; }
    }
  };
}
export const storage = createStorage();
