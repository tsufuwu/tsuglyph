import { app, BrowserWindow, ipcMain, screen, Menu } from 'electron';
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

// Disable background throttling flags so Gamepad API and animations run at full 60fps in background games
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');

function loadWindowContent(win: BrowserWindow, hash: string): void {
  if (isDev) {
    win.loadURL(`http://localhost:5173#${hash}`);
  } else {
    const indexPath = path.join(__dirname, '../../renderer/index.html');
    win.loadFile(indexPath, { hash });
  }
}

function createOverlayWindow(): BrowserWindow {
  const config = configManager.getConfig();
  const activeProfile = config.profiles.find((p) => p.id === config.activeProfileId) || config.profiles[0];
  const posX = activeProfile?.position?.x ?? 1500;
  const posY = activeProfile?.position?.y ?? 700;

  const win = new BrowserWindow({
    x: posX,
    y: posY,
    width: 520,
    height: 480,
    frame: false,
    transparent: true,
    roundedCorners: false,
    backgroundColor: '#00000000',
    thickFrame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    focusable: false,
    skipTaskbar: true,
    hasShadow: false,
    autoHideMenuBar: false,
    title: '',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  // Level 'screen-saver' with priority 1 to ensure it sits on top of borderless fullscreen games
  win.setAlwaysOnTop(true, 'screen-saver', 1);
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setMenu(null);
  win.setMenuBarVisibility(false);
  win.removeMenu();
  win.setBackgroundColor('#00000000');

  // Start with click-through enabled so clicks pass to background apps/games
  win.setIgnoreMouseEvents(true, { forward: true });

  loadWindowContent(win, 'overlay');

  win.once('ready-to-show', () => {
    win.showInactive();
  });

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
    title: 'TsuGlyph - Cài đặt & Tùy biến',
    backgroundColor: '#0f1117',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    autoHideMenuBar: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenu(null);
  if (typeof win.removeMenu === 'function') {
    win.removeMenu();
  }

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
  const active = config.profiles.find((p) => p.id === config.activeProfileId);
  if (active && overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.setPosition(active.position.x, active.position.y);
  }
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

  ipcMain.handle('quit-app', () => {
    app.quit();
  });

  ipcMain.on('set-ignore-mouse-events', (event, ignore: boolean, options: { forward?: boolean }) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && !win.isDestroyed()) {
      win.setIgnoreMouseEvents(ignore, { forward: options?.forward ?? true });
    }
  });

  ipcMain.handle('set-overlay-position', (_event, pos: Position) => {
    const config = configManager.getConfig();
    const active = config.profiles.find((p) => p.id === config.activeProfileId);
    if (active) {
      active.position = pos;
      configManager.saveConfig(config);
      if (overlayWindow && !overlayWindow.isDestroyed()) {
        overlayWindow.setPosition(pos.x, pos.y);
      }
      notifyConfigChanged(config);
    }
  });

  ipcMain.handle('set-overlay-size', (_event, size: { width: number; height: number }) => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.setSize(Math.round(size.width), Math.round(size.height));
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
      Menu.setApplicationMenu(null);
      configManager = new ConfigManager();
      setupIpc();

      overlayWindow = createOverlayWindow();

      // Startup behavior: open Settings by default unless user opted for overlay-only mode
      const cfg = configManager.getConfig();
      if (!cfg.startWithOverlayOnly) {
        createSettingsWindow();
      }

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
      // Periodic watchdog to keep overlay reliably on top of borderless fullscreen games
      setInterval(() => {
        if (overlayWindow && !overlayWindow.isDestroyed() && configManager.getConfig().isVisible) {
          overlayWindow.moveTop();
        }
      }, 1000);
    });
  }
}
