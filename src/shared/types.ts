export type ConsoleLayoutId =
  | 'dualsense'
  | 'xbox'
  | 'switch'
  | 'gamecube'
  | 'n64'
  | 'snes'
  | 'gba_nds'
  | 'ps_classic'
  | 'psp_vita'
  | 'dreamcast'
  | 'sega_six_button';

export type PhysicalControllerType = 'xbox' | 'playstation' | 'switch';

export type DisplayMode = 'compact' | 'full';

export interface ButtonMappingTarget {
  type: 'button' | 'axis';
  index: number;
  direction?: 'positive' | 'negative'; // For analog axis (-1 or +1)
}

export type CustomMapping = Record<string, ButtonMappingTarget>;

export interface ThemeColors {
  primary: string;
  background: string;
  border: string;
  text: string;
  pressedGlow: string;
}

export interface ProfileTheme {
  id: 'original' | 'minimal_white' | 'dark_matte' | 'neon_cyber' | 'custom';
  customColors?: ThemeColors;
}

export interface Position {
  x: number;
  y: number;
}

export interface Profile {
  id: string;
  name: string;
  layout: ConsoleLayoutId;
  displayMode: DisplayMode;
  showShoulders: boolean;
  dualLabelEnabled: boolean;      // Show sub-labels (physical key hints) INSIDE each button
  showPhysicalLayoutBelow: boolean; // Show a SEPARATE physical layout panel BELOW the console layout
  physicalLayout: PhysicalControllerType;
  staticCheatSheet: boolean;
  scale: number; // 0.5 - 2.5
  opacity: number; // 0.1 - 1.0
  position: Position;
  theme: ProfileTheme;
  customMapping: CustomMapping;
}

export interface AppConfig {
  activeProfileId: string;
  isLocked: boolean; // true = click-through (ignore mouse events), false = draggable edit mode
  isVisible: boolean;
  startWithOverlayOnly: boolean; // If true, skip Settings on startup and show overlay directly
  profiles: Profile[];
}


export interface GamepadState {
  connected: boolean;
  id: string;
  buttons: boolean[];
  buttonValues: number[];
  axes: number[];
}

// IPC Interface definition
export interface ElectronAPI {
  getConfig: () => Promise<AppConfig>;
  saveConfig: (config: AppConfig) => Promise<boolean>;
  toggleLock: () => Promise<boolean>;
  setLock: (locked: boolean) => Promise<boolean>;
  toggleVisibility: () => Promise<boolean>;
  openSettings: () => Promise<void>;
  closeSettings: () => Promise<void>;
  quitApp: () => Promise<void>;
  setOverlayPosition: (pos: Position) => Promise<void>;
  setOverlaySize: (size: { width: number; height: number }) => Promise<void>;
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) => void;
  onConfigChanged: (callback: (config: AppConfig) => void) => () => void;
  onLockChanged: (callback: (locked: boolean) => void) => () => void;
  onProfileCycle: (callback: (direction: 'next' | 'prev') => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
