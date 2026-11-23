import { ConsoleLayoutId, PhysicalControllerType, ProfileTheme, ButtonMappingTarget } from '../../shared/types';

export interface LayoutButtonInfo {
  id: string;
  name: string;
  label: string;
  subLabel?: string; // Physical button hint (Dual-label)
  color?: string;
  textColor?: string;
  shape?: 'circle' | 'kidney-x' | 'kidney-y' | 'oval' | 'pill' | 'trigger' | 'c-button' | 'dpad';
  x: number;
  y: number;
  width?: number;
  height?: number;
  cDirection?: 'up' | 'down' | 'left' | 'right';
  psSymbol?: 'cross' | 'circle' | 'square' | 'triangle';
}

export interface ConsoleLayoutProps {
  layoutId: ConsoleLayoutId;
  isCompact: boolean;
  showShoulders: boolean;
  dualLabelEnabled: boolean;
  physicalLayout: PhysicalControllerType;
  staticCheatSheet: boolean;
  activeButtons: Set<string>;
  theme: ProfileTheme;
  scale?: number;
  onButtonClick?: (buttonId: string) => void;
  selectedButtonForRemap?: string | null;
}
