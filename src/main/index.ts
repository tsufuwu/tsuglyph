import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { ConfigManager } from './config';
import { registerGlobalShortcuts, unregisterGlobalShortcuts } from './shortcuts';
import { setupTray, updateTrayMenu } from './tray';
import { AppConfig, Position } from '../shared/types';

let overlayWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let configManager: ConfigManager;

const isDev = process.env.NODE_ENV === 'development';

function loadWindowContent(win: BrowserWindow, hash: string): void {
  if (isDev) {
    win.loadURL(`http://localhost:5173#${hash}`);
  } else {
    const indexPath = path.join(__dirname, '../../renderer/index.html');
    win.loadFile(indexPath, { hash });
  }
}

function createOverlayWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    focusable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Level 'screen-saver' to ensure it sits on top of borderless fullscreen games
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  const config = configManager.getConfig();
  if (config.isLocked) {
    win.setIgnoreMouseEvents(true, { forward: true });
  } else {
    win.setIgnoreMouseEvents(false);
  }

  loadWindowContent(win, 'overlay');

  win.on('closed', () => {
    overlayWindow = null;
  });

  return win;
}

function createSettingsWindow(): BrowserWindow {
  if (settingsWindow) {
    settingsWindow.show();
    settingsWindow.focus();
    return settingsWindow;
  }

  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'resources/icon.png')
    : path.join(__dirname, '../../resources/icon.png');

  const win = new BrowserWindow({
    width: 980,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    title: 'UniPad Overlay - Cài đặt & Tùy biến',
    backgroundColor: '#0f1117',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  loadWindowContent(win, 'settings');

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    settingsWindow = null;
  });

  return win;
}

function notifyConfigChanged(config: AppConfig): void {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('config-changed', config);
  }
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.webContents.send('config-changed', config);
  }
}

function notifyLockChanged(locked: boolean): void {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('lock-changed', locked);
    overlayWindow.setIgnoreMouseEvents(locked, { forward: true });
  }
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.webContents.send('lock-changed', locked);
  }
}

function cycleProfile(direction: 'next' | 'prev'): void {
  const config = configManager.getConfig();
  const profiles = config.profiles;
  if (!profiles.length) return;

  const currentIndex = profiles.findIndex((p) => p.id === config.activeProfileId);
  let nextIndex = 0;
  if (direction === 'next') {
    nextIndex = (currentIndex + 1) % profiles.length;
  } else {
    nextIndex = (currentIndex - 1 + profiles.length) % profiles.length;
  }

  const nextProfile = profiles[nextIndex];
  config.activeProfileId = nextProfile.id;
  configManager.saveConfig(config);
  notifyConfigChanged(config);
  updateTray();
}

function toggleLock(): boolean {
  const config = configManager.getConfig();
  config.isLocked = !config.isLocked;
  configManager.saveConfig(config);
  notifyLockChanged(config.isLocked);
  updateTray();
  return config.isLocked;
}

function toggleVisibility(): boolean {
  const config = configManager.getConfig();
  config.isVisible = !config.isVisible;
  configManager.saveConfig(config);

  if (overlayWindow && !overlayWindow.isDestroyed()) {
    if (config.isVisible) {
      overlayWindow.show();
    } else {
      overlayWindow.hide();
    }
  }

  notifyConfigChanged(config);
  updateTray();
  return config.isVisible;
}

function updateTray(): void {
  const config = configManager.getConfig();
  updateTrayMenu(config, {
    onToggleLock: () => toggleLock(),
    onToggleVisibility: () => toggleVisibility(),
    onOpenSettings: () => createSettingsWindow(),
    onSelectProfile: (id) => {
      config.activeProfileId = id;
      configManager.saveConfig(config);
      notifyConfigChanged(config);
      updateTray();
    },
    onQuit: () => app.quit(),
  });
}

function setupIpc(): void {
  ipcMain.handle('get-config', () => {
    return configManager.getConfig();
  });

  ipcMain.handle('save-config', (_event, newConfig: AppConfig) => {
    const success = configManager.saveConfig(newConfig);
    if (success) {
      notifyConfigChanged(newConfig);
      updateTray();
    }
    return success;
  });

  ipcMain.handle('toggle-lock', () => {
    return toggleLock();
  });

  ipcMain.handle('set-lock', (_event, locked: boolean) => {
    const config = configManager.getConfig();
    config.isLocked = locked;
    configManager.saveConfig(config);
    notifyLockChanged(locked);
    updateTray();
    return locked;
  });

  ipcMain.handle('toggle-visibility', () => {
    return toggleVisibility();
  });

  ipcMain.handle('open-settings', () => {
    createSettingsWindow();
  });

  ipcMain.handle('close-settings', () => {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.close();
    }
  });

  ipcMain.handle('set-overlay-position', (_event, pos: Position) => {
    const config = configManager.getConfig();
    const active = config.profiles.find((p) => p.id === config.activeProfileId);
    if (active) {
      active.position = pos;
      configManager.saveConfig(config);
      notifyConfigChanged(config);
    }
  });
}

// Safeguard against ELECTRON_RUN_AS_NODE environment variable leak on Windows
if (!app || typeof app.requestSingleInstanceLock !== 'function') {
  const electronBin = typeof require('electron') === 'string' ? require('electron') : process.execPath;
  const cleanEnv = { ...process.env };
  delete cleanEnv.ELECTRON_RUN_AS_NODE;
  const child = spawn(electronBin, [path.resolve(__dirname, '../../..')], {
    stdio: 'inherit',
    env: cleanEnv,
  });
  child.on('close', (code) => process.exit(code ?? 0));
} else {
  // Single instance lock
  const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (settingsWindow) {
      if (settingsWindow.isMinimized()) settingsWindow.restore();
      settingsWindow.focus();
    } else {
      createSettingsWindow();
    }
  });

  app.whenReady().then(() => {
    configManager = new ConfigManager();
    setupIpc();

    overlayWindow = createOverlayWindow();
    setupTray(configManager.getConfig(), {
      onToggleLock: () => toggleLock(),
      onToggleVisibility: () => toggleVisibility(),
      onOpenSettings: () => createSettingsWindow(),
      onSelectProfile: (id) => {
        const config = configManager.getConfig();
        config.activeProfileId = id;
        configManager.saveConfig(config);
        notifyConfigChanged(config);
        updateTray();
      },
      onQuit: () => app.quit(),
    });

    registerGlobalShortcuts({
      onToggleLock: () => toggleLock(),
      onToggleVisibility: () => toggleVisibility(),
      onOpenSettings: () => createSettingsWindow(),
      onNextProfile: () => cycleProfile('next'),
      onPrevProfile: () => cycleProfile('prev'),
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        overlayWindow = createOverlayWindow();
      }
    });
  });

  app.on('will-quit', () => {
    unregisterGlobalShortcuts();
  });

  app.on('window-all-closed', () => {
    // Keep running in tray on Windows
  });
}
}
