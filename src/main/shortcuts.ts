import { globalShortcut } from 'electron';

export interface ShortcutHandlers {
  onToggleLock: () => void;
  onToggleVisibility: () => void;
  onOpenSettings: () => void;
  onNextProfile: () => void;
  onPrevProfile: () => void;
}

export function registerGlobalShortcuts(handlers: ShortcutHandlers): void {
  // Unregister all previous shortcuts
  globalShortcut.unregisterAll();

  // Ctrl+Shift+L: Toggle Lock (Click-through / Edit mode)
  try {
    globalShortcut.register('CommandOrControl+Shift+L', () => {
      handlers.onToggleLock();
    });
  } catch (e) {
    console.error('Failed to register Ctrl+Shift+L:', e);
  }

  // Ctrl+Shift+H: Toggle Visibility
  try {
    globalShortcut.register('CommandOrControl+Shift+H', () => {
      handlers.onToggleVisibility();
    });
  } catch (e) {
    console.error('Failed to register Ctrl+Shift+H:', e);
  }

  // Ctrl+Shift+S: Open Settings
  try {
    globalShortcut.register('CommandOrControl+Shift+S', () => {
      handlers.onOpenSettings();
    });
  } catch (e) {
    console.error('Failed to register Ctrl+Shift+S:', e);
  }

  // Ctrl+Shift+]: Next Profile
  try {
    globalShortcut.register('CommandOrControl+Shift+]', () => {
      handlers.onNextProfile();
    });
  } catch (e) {
    console.error('Failed to register Ctrl+Shift+]:', e);
  }

  // Ctrl+Shift+[: Prev Profile
  try {
    globalShortcut.register('CommandOrControl+Shift+[', () => {
      handlers.onPrevProfile();
    });
  } catch (e) {
    console.error('Failed to register Ctrl+Shift+[:', e);
  }
}

export function unregisterGlobalShortcuts(): void {
  globalShortcut.unregisterAll();
}
