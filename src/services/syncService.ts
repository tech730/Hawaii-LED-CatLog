export interface SavedConfig {
  id: string;
  timestamp: number;
  clientName: string;
  projectName: string;
  data: any;
}

const STORAGE_KEY = 'hawaii_led_configs';

export const syncService = {
  saveConfig: (data: any, client: string = 'Unnamed Client', project: string = 'New Project') => {
    const configs = syncService.getAllConfigs();
    const newConfig: SavedConfig = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      clientName: client,
      projectName: project,
      data
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newConfig, ...configs]));
    return newConfig;
  },

  getAllConfigs: (): SavedConfig[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  deleteConfig: (id: string) => {
    const configs = syncService.getAllConfigs().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  }
};
