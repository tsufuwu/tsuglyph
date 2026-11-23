import { Tray, Menu, nativeImage, NativeImage, app } from 'electron';
import path from 'path';
import { AppConfig } from '../shared/types';

export interface TrayCallbacks {
  onToggleLock: () => void;
  onToggleVisibility: () => void;
  onOpenSettings: () => void;
  onSelectProfile: (profileId: string) => void;
  onQuit: () => void;
}

let trayInstance: Tray | null = null;

// Generate a fallback 16x16 icon in case resource icon is not yet available
function createDefaultTrayIcon(): NativeImage {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="3" fill="#1e293b"/>
      <circle cx="5" cy="8" r="2" fill="#3b82f6"/>
      <circle cx="11" cy="6" r="1.5" fill="#ef4444"/>
      <circle cx="11" cy="10" r="1.5" fill="#10b981"/>
    </svg>
  `;
  return nativeImage.createFromBuffer(Buffer.from(svg));
}

export function setupTray(config: AppConfig, callbacks: TrayCallbacks): Tray {
  if (trayInstance) {
    updateTrayMenu(config, callbacks);
    return trayInstance;
  }

  const icon = createDefaultTrayIcon();
  trayInstance = new Tray(icon);
  trayInstance.setToolTip('UniPad Overlay - Gamepad Button Overlay');

  trayInstance.on('double-click', () => {
    callbacks.onOpenSettings();
  });

  updateTrayMenu(config, callbacks);
  return trayInstance;
}

export function updateTrayMenu(config: AppConfig, callbacks: TrayCallbacks): void {
  if (!trayInstance) return;

  const profileMenuItems = config.profiles.map((profile) => ({
    label: profile.name,
    type: 'radio' as const,
    checked: profile.id === config.activeProfileId,
    click: () => callbacks.onSelectProfile(profile.id),
  }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🎮 UniPad Overlay',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Cấu hình Profile:',
      submenu: profileMenuItems,
    },
    { type: 'separator' },
    {
      label: `Chế độ Khóa (Click-through): ${config.isLocked ? 'BẬT' : 'TẮT (Kéo thả)'}`,
      type: 'checkbox',
      checked: config.isLocked,
      accelerator: 'CmdOrCtrl+Shift+L',
      click: () => callbacks.onToggleLock(),
    },
    {
      label: 'Hiển thị Overlay',
      type: 'checkbox',
      checked: config.isVisible,
      accelerator: 'CmdOrCtrl+Shift+H',
      click: () => callbacks.onToggleVisibility(),
    },
    { type: 'separator' },
    {
      label: '⚙ Cài đặt (Settings)...',
      accelerator: 'CmdOrCtrl+Shift+S',
      click: () => callbacks.onOpenSettings(),
    },
    {
      label: 'Thoát ứng dụng',
      click: () => callbacks.onQuit(),
    },
  ]);

  trayInstance.setContextMenu(contextMenu);
}
