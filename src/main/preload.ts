import { contextBridge, ipcRenderer } from 'electron';
import { AppConfig, Position } from '../shared/types';

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: (): Promise<AppConfig> => ipcRenderer.invoke('get-config'),
  saveConfig: (config: AppConfig): Promise<boolean> => ipcRenderer.invoke('save-config', config),
  toggleLock: (): Promise<boolean> => ipcRenderer.invoke('toggle-lock'),
  setLock: (locked: boolean): Promise<boolean> => ipcRenderer.invoke('set-lock', locked),
  toggleVisibility: (): Promise<boolean> => ipcRenderer.invoke('toggle-visibility'),
  openSettings: (): Promise<void> => ipcRenderer.invoke('open-settings'),
  closeSettings: (): Promise<void> => ipcRenderer.invoke('close-settings'),
  setOverlayPosition: (pos: Position): Promise<void> => ipcRenderer.invoke('set-overlay-position', pos),
  setOverlaySize: (size: { width: number; height: number }): Promise<void> => ipcRenderer.invoke('set-overlay-size', size),
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean): void => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, { forward: forward ?? true });
  },

  onConfigChanged: (callback: (config: AppConfig) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, config: AppConfig) => callback(config);
    ipcRenderer.on('config-changed', handler);
    return () => ipcRenderer.removeListener('config-changed', handler);
  },

  onLockChanged: (callback: (locked: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, locked: boolean) => callback(locked);
    ipcRenderer.on('lock-changed', handler);
    return () => ipcRenderer.removeListener('lock-changed', handler);
  },

  onProfileCycle: (callback: (direction: 'next' | 'prev') => void) => {
    const handler = (_event: Electron.IpcRendererEvent, direction: 'next' | 'prev') => callback(direction);
    ipcRenderer.on('profile-cycle', handler);
    return () => ipcRenderer.removeListener('profile-cycle', handler);
  },
});
