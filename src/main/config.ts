import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { AppConfig } from '../shared/types';
import { DEFAULT_APP_CONFIG } from '../shared/defaultConfigs';

export class ConfigManager {
  private configFilePath: string;
  private currentConfig: AppConfig;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.configFilePath = path.join(userDataPath, 'config.json');
    this.currentConfig = this.load();
  }

  public getConfig(): AppConfig {
    return this.currentConfig;
  }

  public saveConfig(newConfig: AppConfig): boolean {
    try {
      this.currentConfig = newConfig;
      fs.writeFileSync(this.configFilePath, JSON.stringify(newConfig, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('[ConfigManager] Failed to write config file:', err);
      return false;
    }
  }

  private load(): AppConfig {
    try {
      if (fs.existsSync(this.configFilePath)) {
        const raw = fs.readFileSync(this.configFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required fields exist by shallow merging with defaults
        return {
          ...DEFAULT_APP_CONFIG,
          ...parsed,
          startWithOverlayOnly: parsed.startWithOverlayOnly ?? false,
          profiles: Array.isArray(parsed.profiles) && parsed.profiles.length > 0
            ? parsed.profiles.map((p: any) => ({
                showPhysicalLayoutBelow: false,
                ...p,
              }))
            : DEFAULT_APP_CONFIG.profiles,
        };
      }
    } catch (err) {
      console.warn('[ConfigManager] Failed to read config, falling back to defaults:', err);
    }

    // Default save on first run
    try {
      fs.writeFileSync(this.configFilePath, JSON.stringify(DEFAULT_APP_CONFIG, null, 2), 'utf-8');
    } catch (e) {
      console.error('[ConfigManager] Error initializing default config:', e);
    }
    return DEFAULT_APP_CONFIG;
  }
}
