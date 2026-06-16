const STORAGE_PREFIX = 'gov_list_training_';

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const fullKey = STORAGE_PREFIX + key;
      const item = localStorage.getItem(fullKey);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      const fullKey = STORAGE_PREFIX + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove(key: string): void {
    try {
      const fullKey = STORAGE_PREFIX + key;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  exportData(): string {
    const data: Record<string, unknown> = {};
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => {
        const shortKey = key.replace(STORAGE_PREFIX, '');
        data[shortKey] = JSON.parse(localStorage.getItem(key) || 'null');
      });
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
      return true;
    } catch {
      return false;
    }
  }
};
