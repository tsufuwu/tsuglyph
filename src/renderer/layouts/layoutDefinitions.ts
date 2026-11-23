import { ConsoleLayoutId, PhysicalControllerType } from '../../shared/types';
import { LayoutButtonInfo } from './types';

// Helper for physical dual-label hints
function getSubLabel(layoutId: ConsoleLayoutId, buttonId: string, physical: PhysicalControllerType): string | undefined {
  if (physical === 'xbox') {
    const xboxHints: Record<string, string> = {
      // PlayStation
      cross: 'A',
      circle: 'B',
      square: 'X',
      triangle: 'Y',
      l1: 'LB',
      r1: 'RB',
      l2: 'LT',
      r2: 'RT',
      share: 'View',
      options: 'Menu',

      // Switch
      b: 'A',
      a: 'B',
      y: 'X',
      x: 'Y',
      l: 'LB',
      r: 'RB',
      zl: 'LT',
      zr: 'RT',
      minus: 'View',
      plus: 'Menu',

      // GameCube
      gc_a: 'A',
      gc_b: 'X',
      gc_x: 'B',
      gc_y: 'Y',
      gc_z: 'RB',
      gc_l: 'LT',
      gc_r: 'RT',
      gc_start: 'Menu',
      c_stick_up: 'RS▲',
      c_stick_down: 'RS▼',
      c_stick_left: 'RS◄',
      c_stick_right: 'RS►',

      // N64
      n64_a: 'A',
      n64_b: 'X',
      c_up: 'RS▲',
      c_down: 'RS▼',
      c_left: 'RS◄',
      c_right: 'RS►',
      n64_l: 'LB',
      n64_r: 'RB',
      n64_z: 'LT',
      n64_start: 'Menu',

      // SNES
      snes_b: 'A',
      snes_a: 'B',
      snes_y: 'X',
      snes_x: 'Y',
      snes_l: 'LB',
      snes_r: 'RB',
      snes_select: 'View',
      snes_start: 'Menu',

      // GBA / NDS
      gba_b: 'A',
      gba_a: 'B',
      nds_y: 'X',
      nds_x: 'Y',
      gba_l: 'LB',
      gba_r: 'RB',
      gba_select: 'View',
      gba_start: 'Menu',

      // Dreamcast
      dc_a: 'A',
      dc_b: 'B',
      dc_x: 'X',
      dc_y: 'Y',
      dc_l: 'LT',
      dc_r: 'RT',
      dc_start: 'Menu',

      // Sega 6-Button
      sega_a: 'A',
      sega_b: 'B',
      sega_c: 'RB',
      sega_x: 'X',
      sega_y: 'Y',
      sega_z: 'LB',
      sega_l: 'LT',
      sega_r: 'RT',
      sega_mode: 'View',
      sega_start: 'Menu',
    };
    return xboxHints[buttonId];
  }
  return undefined;
}

export function getLayoutButtons(
  layoutId: ConsoleLayoutId,
  isCompact: boolean,
  showShoulders: boolean,
  physicalLayout: PhysicalControllerType
): { buttons: LayoutButtonInfo[]; viewBox: string; width: number; height: number } {
  const buttons: LayoutButtonInfo[] = [];

  switch (layoutId) {
    case 'dualsense': {
      if (isCompact) {
        // Face buttons diamond
        buttons.push(
          { id: 'triangle', name: 'Triangle', label: '△', psSymbol: 'triangle', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 80, y: 35, width: 38 },
          { id: 'square', name: 'Square', label: '□', psSymbol: 'square', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 40, y: 75, width: 38 },
          { id: 'circle', name: 'Circle', label: '○', psSymbol: 'circle', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 120, y: 75, width: 38 },
          { id: 'cross', name: 'Cross', label: '✕', psSymbol: 'cross', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 80, y: 115, width: 38 }
        );

        if (showShoulders) {
          buttons.push(
            { id: 'l2', name: 'L2 Trigger', label: 'L2', color: '#0f172a', shape: 'trigger', x: 35, y: 165, width: 50, height: 26 },
            { id: 'l1', name: 'L1 Bumper', label: 'L1', color: '#1e293b', shape: 'pill', x: 35, y: 198, width: 50, height: 22 },
            { id: 'r2', name: 'R2 Trigger', label: 'R2', color: '#0f172a', shape: 'trigger', x: 125, y: 165, width: 50, height: 26 },
            { id: 'r1', name: 'R1 Bumper', label: 'R1', color: '#1e293b', shape: 'pill', x: 125, y: 198, width: 50, height: 22 }
          );
          return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 160 220', width: 160, height: 220 };
        }
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 10 140 135', width: 140, height: 135 };
      } else {
        // Full Controller
        // D-Pad left
        buttons.push(
          { id: 'dpad_up', name: 'D-Pad Up', label: '▲', color: '#1e293b', shape: 'pill', x: 60, y: 70, width: 28, height: 28 },
          { id: 'dpad_left', name: 'D-Pad Left', label: '◄', color: '#1e293b', shape: 'pill', x: 35, y: 95, width: 28, height: 28 },
          { id: 'dpad_right', name: 'D-Pad Right', label: '►', color: '#1e293b', shape: 'pill', x: 85, y: 95, width: 28, height: 28 },
          { id: 'dpad_down', name: 'D-Pad Down', label: '▼', color: '#1e293b', shape: 'pill', x: 60, y: 120, width: 28, height: 28 }
        );
        // Face buttons right
        buttons.push(
          { id: 'triangle', name: 'Triangle', label: '△', psSymbol: 'triangle', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 280, y: 70, width: 34 },
          { id: 'square', name: 'Square', label: '□', psSymbol: 'square', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 250, y: 95, width: 34 },
          { id: 'circle', name: 'Circle', label: '○', psSymbol: 'circle', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 310, y: 95, width: 34 },
          { id: 'cross', name: 'Cross', label: '✕', psSymbol: 'cross', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 280, y: 120, width: 34 }
        );
        // Sticks
        buttons.push(
          { id: 'l3', name: 'L3 Stick', label: 'L3', color: '#334155', shape: 'circle', x: 115, y: 145, width: 38 },
          { id: 'r3', name: 'R3 Stick', label: 'R3', color: '#334155', shape: 'circle', x: 225, y: 145, width: 38 }
        );
        // Middle & Shoulders
        buttons.push(
          { id: 'share', name: 'Create', label: 'CREATE', color: '#1e293b', shape: 'pill', x: 120, y: 70, width: 40, height: 16 },
          { id: 'touchpad', name: 'Touchpad', label: 'TOUCHPAD', color: '#090d16', shape: 'pill', x: 170, y: 80, width: 50, height: 28 },
          { id: 'options', name: 'Options', label: 'OPTIONS', color: '#1e293b', shape: 'pill', x: 220, y: 70, width: 40, height: 16 },
          { id: 'l2', name: 'L2', label: 'L2', color: '#0f172a', shape: 'trigger', x: 60, y: 22, width: 50, height: 20 },
          { id: 'l1', name: 'L1', label: 'L1', color: '#1e293b', shape: 'pill', x: 60, y: 44, width: 50, height: 18 },
          { id: 'r2', name: 'R2', label: 'R2', color: '#0f172a', shape: 'trigger', x: 280, y: 22, width: 50, height: 20 },
          { id: 'r1', name: 'R1', label: 'R1', color: '#1e293b', shape: 'pill', x: 280, y: 44, width: 50, height: 18 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 340 180', width: 340, height: 180 };
      }
    }

    case 'xbox': {
      if (isCompact) {
        buttons.push(
          { id: 'y', name: 'Y Button', label: 'Y', color: '#ca8a04', textColor: '#ffffff', shape: 'circle', x: 80, y: 35, width: 38 },
          { id: 'x', name: 'X Button', label: 'X', color: '#2563eb', textColor: '#ffffff', shape: 'circle', x: 40, y: 75, width: 38 },
          { id: 'b', name: 'B Button', label: 'B', color: '#dc2626', textColor: '#ffffff', shape: 'circle', x: 120, y: 75, width: 38 },
          { id: 'a', name: 'A Button', label: 'A', color: '#16a34a', textColor: '#ffffff', shape: 'circle', x: 80, y: 115, width: 38 }
        );
        if (showShoulders) {
          buttons.push(
            { id: 'lt', name: 'LT Trigger', label: 'LT', color: '#0f172a', shape: 'trigger', x: 35, y: 165, width: 50, height: 26 },
            { id: 'lb', name: 'LB Bumper', label: 'LB', color: '#1e293b', shape: 'pill', x: 35, y: 198, width: 50, height: 22 },
            { id: 'rt', name: 'RT Trigger', label: 'RT', color: '#0f172a', shape: 'trigger', x: 125, y: 165, width: 50, height: 26 },
            { id: 'rb', name: 'RB Bumper', label: 'RB', color: '#1e293b', shape: 'pill', x: 125, y: 198, width: 50, height: 22 }
          );
          return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 160 220', width: 160, height: 220 };
        }
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 10 140 135', width: 140, height: 135 };
      } else {
        // Full Xbox layout
        buttons.push(
          { id: 'ls', name: 'Left Stick', label: 'LS', color: '#334155', shape: 'circle', x: 70, y: 80, width: 40 },
          { id: 'dpad_up', name: 'D-Pad Up', label: '▲', color: '#1e293b', shape: 'pill', x: 110, y: 110, width: 26, height: 26 },
          { id: 'dpad_left', name: 'D-Pad Left', label: '◄', color: '#1e293b', shape: 'pill', x: 88, y: 132, width: 26, height: 26 },
          { id: 'dpad_right', name: 'D-Pad Right', label: '►', color: '#1e293b', shape: 'pill', x: 132, y: 132, width: 26, height: 26 },
          { id: 'dpad_down', name: 'D-Pad Down', label: '▼', color: '#1e293b', shape: 'pill', x: 110, y: 154, width: 26, height: 26 },
          { id: 'view', name: 'View', label: '⧉', color: '#1e293b', shape: 'circle', x: 140, y: 75, width: 22 },
          { id: 'guide', name: 'Xbox', label: 'X', color: '#16a34a', shape: 'circle', x: 170, y: 65, width: 28 },
          { id: 'menu', name: 'Menu', label: '☰', color: '#1e293b', shape: 'circle', x: 200, y: 75, width: 22 },
          { id: 'y', name: 'Y Button', label: 'Y', color: '#ca8a04', textColor: '#ffffff', shape: 'circle', x: 270, y: 65, width: 34 },
          { id: 'x', name: 'X Button', label: 'X', color: '#2563eb', textColor: '#ffffff', shape: 'circle', x: 242, y: 90, width: 34 },
          { id: 'b', name: 'B Button', label: 'B', color: '#dc2626', textColor: '#ffffff', shape: 'circle', x: 298, y: 90, width: 34 },
          { id: 'a', name: 'A Button', label: 'A', color: '#16a34a', textColor: '#ffffff', shape: 'circle', x: 270, y: 115, width: 34 },
          { id: 'rs', name: 'Right Stick', label: 'RS', color: '#334155', shape: 'circle', x: 225, y: 135, width: 40 },
          { id: 'lt', name: 'LT', label: 'LT', color: '#0f172a', shape: 'trigger', x: 60, y: 22, width: 50, height: 20 },
          { id: 'lb', name: 'LB', label: 'LB', color: '#1e293b', shape: 'pill', x: 60, y: 44, width: 50, height: 18 },
          { id: 'rt', name: 'RT', label: 'RT', color: '#0f172a', shape: 'trigger', x: 280, y: 22, width: 50, height: 20 },
          { id: 'rb', name: 'RB', label: 'RB', color: '#1e293b', shape: 'pill', x: 280, y: 44, width: 50, height: 18 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 340 180', width: 340, height: 180 };
      }
    }

    case 'switch': {
      if (isCompact) {
        // Switch face buttons (B bottom, A right, Y left, X top)
        buttons.push(
          { id: 'x', name: 'X Button', label: 'X', color: '#1e293b', textColor: '#cbd5e1', shape: 'circle', x: 80, y: 35, width: 38 },
          { id: 'y', name: 'Y Button', label: 'Y', color: '#1e293b', textColor: '#cbd5e1', shape: 'circle', x: 40, y: 75, width: 38 },
          { id: 'a', name: 'A Button', label: 'A', color: '#1e293b', textColor: '#cbd5e1', shape: 'circle', x: 120, y: 75, width: 38 },
          { id: 'b', name: 'B Button', label: 'B', color: '#1e293b', textColor: '#cbd5e1', shape: 'circle', x: 80, y: 115, width: 38 }
        );
        if (showShoulders) {
          buttons.push(
            { id: 'zl', name: 'ZL Trigger', label: 'ZL', color: '#0f172a', shape: 'trigger', x: 35, y: 165, width: 50, height: 26 },
            { id: 'l', name: 'L Bumper', label: 'L', color: '#1e293b', shape: 'pill', x: 35, y: 198, width: 50, height: 22 },
            { id: 'zr', name: 'ZR Trigger', label: 'ZR', color: '#0f172a', shape: 'trigger', x: 125, y: 165, width: 50, height: 26 },
            { id: 'r', name: 'R Bumper', label: 'R', color: '#1e293b', shape: 'pill', x: 125, y: 198, width: 50, height: 22 }
          );
          return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 160 220', width: 160, height: 220 };
        }
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 10 140 135', width: 140, height: 135 };
      } else {
        buttons.push(
          { id: 'l3', name: 'Left Stick', label: 'LS', color: '#334155', shape: 'circle', x: 70, y: 80, width: 40 },
          { id: 'minus', name: 'Minus', label: '—', color: '#1e293b', shape: 'circle', x: 125, y: 65, width: 22 },
          { id: 'capture', name: 'Capture', label: '⊚', color: '#1e293b', shape: 'pill', x: 125, y: 120, width: 24, height: 24 },
          { id: 'dpad_up', name: 'D-Pad Up', label: '▲', color: '#1e293b', shape: 'circle', x: 85, y: 125, width: 24 },
          { id: 'dpad_left', name: 'D-Pad Left', label: '◄', color: '#1e293b', shape: 'circle', x: 65, y: 145, width: 24 },
          { id: 'dpad_right', name: 'D-Pad Right', label: '►', color: '#1e293b', shape: 'circle', x: 105, y: 145, width: 24 },
          { id: 'dpad_down', name: 'D-Pad Down', label: '▼', color: '#1e293b', shape: 'circle', x: 85, y: 165, width: 24 },
          { id: 'plus', name: 'Plus', label: '+', color: '#1e293b', shape: 'circle', x: 215, y: 65, width: 22 },
          { id: 'x', name: 'X Button', label: 'X', color: '#1e293b', shape: 'circle', x: 270, y: 65, width: 34 },
          { id: 'y', name: 'Y Button', label: 'Y', color: '#1e293b', shape: 'circle', x: 242, y: 90, width: 34 },
          { id: 'a', name: 'A Button', label: 'A', color: '#1e293b', shape: 'circle', x: 298, y: 90, width: 34 },
          { id: 'b', name: 'B Button', label: 'B', color: '#1e293b', shape: 'circle', x: 270, y: 115, width: 34 },
          { id: 'r3', name: 'Right Stick', label: 'RS', color: '#334155', shape: 'circle', x: 225, y: 135, width: 40 },
          { id: 'zl', name: 'ZL', label: 'ZL', color: '#0f172a', shape: 'trigger', x: 60, y: 22, width: 50, height: 20 },
          { id: 'l', name: 'L', label: 'L', color: '#1e293b', shape: 'pill', x: 60, y: 44, width: 50, height: 18 },
          { id: 'zr', name: 'ZR', label: 'ZR', color: '#0f172a', shape: 'trigger', x: 280, y: 22, width: 50, height: 20 },
          { id: 'r', name: 'R', label: 'R', color: '#1e293b', shape: 'pill', x: 280, y: 44, width: 50, height: 18 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 340 185', width: 340, height: 185 };
      }
    }

    case 'gamecube': {
      // Iconic GameCube Face Cluster
      buttons.push(
        // Big round Green A in center
        { id: 'gc_a', name: 'A Button (Large Green)', label: 'A', color: '#059669', textColor: '#ffffff', shape: 'circle', x: 80, y: 80, width: 54 },
        // Small Red B button on lower-left
        { id: 'gc_b', name: 'B Button (Small Red)', label: 'B', color: '#dc2626', textColor: '#ffffff', shape: 'circle', x: 42, y: 98, width: 30 },
        // Kidney bean X on right
        { id: 'gc_x', name: 'X Button (Bean)', label: 'X', color: '#94a3b8', textColor: '#0f172a', shape: 'kidney-x', x: 120, y: 78, width: 34, height: 44 },
        // Kidney bean Y on top
        { id: 'gc_y', name: 'Y Button (Bean)', label: 'Y', color: '#94a3b8', textColor: '#0f172a', shape: 'kidney-y', x: 80, y: 38, width: 44, height: 34 },
        // Purple Z trigger
        { id: 'gc_z', name: 'Z Button (Purple)', label: 'Z', color: '#7c3aed', textColor: '#ffffff', shape: 'oval', x: 130, y: 24, width: 36, height: 22 }
      );

      if (isCompact) {
        if (showShoulders) {
          buttons.push(
            { id: 'gc_l', name: 'L Trigger', label: 'L', color: '#334155', shape: 'trigger', x: 35, y: 155, width: 50, height: 24 },
            { id: 'gc_r', name: 'R Trigger', label: 'R', color: '#334155', shape: 'trigger', x: 125, y: 155, width: 50, height: 24 },
            { id: 'gc_start', name: 'Start/Pause', label: 'START', color: '#475569', shape: 'circle', x: 80, y: 155, width: 24 }
          );
          return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 5 150 185', width: 150, height: 185 };
        }
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '15 10 145 130', width: 145, height: 130 };
      } else {
        // Full GameCube: add C-Stick, Main Stick, D-pad, Start
        buttons.push(
          { id: 'main_stick', name: 'Control Stick (Gray)', label: 'STICK', color: '#64748b', shape: 'circle', x: 50, y: 80, width: 44 },
          { id: 'dpad_up', name: 'D-Pad Up', label: '▲', color: '#1e293b', shape: 'pill', x: 85, y: 130, width: 22, height: 22 },
          { id: 'dpad_left', name: 'D-Pad Left', label: '◄', color: '#1e293b', shape: 'pill', x: 67, y: 148, width: 22, height: 22 },
          { id: 'dpad_right', name: 'D-Pad Right', label: '►', color: '#1e293b', shape: 'pill', x: 103, y: 148, width: 22, height: 22 },
          { id: 'dpad_down', name: 'D-Pad Down', label: '▼', color: '#1e293b', shape: 'pill', x: 85, y: 166, width: 22, height: 22 },
          { id: 'gc_start', name: 'Start/Pause', label: 'START', color: '#475569', shape: 'circle', x: 150, y: 85, width: 24 },
          // C-Stick (Yellow)
          { id: 'c_stick', name: 'C-Stick (Yellow)', label: 'C', color: '#eab308', textColor: '#0f172a', shape: 'circle', x: 195, y: 135, width: 36 },
          { id: 'gc_l', name: 'L Trigger', label: 'L', color: '#334155', shape: 'trigger', x: 60, y: 22, width: 50, height: 20 },
          { id: 'gc_r', name: 'R Trigger', label: 'R', color: '#334155', shape: 'trigger', x: 260, y: 22, width: 50, height: 20 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 330 185', width: 330, height: 185 };
      }
    }

    case 'n64': {
      // Iconic N64: Blue A, Green B, 4 Yellow C-Buttons
      buttons.push(
        { id: 'n64_a', name: 'A Button (Blue)', label: 'A', color: '#2563eb', textColor: '#ffffff', shape: 'circle', x: 45, y: 105, width: 34 },
        { id: 'n64_b', name: 'B Button (Green)', label: 'B', color: '#16a34a', textColor: '#ffffff', shape: 'circle', x: 30, y: 68, width: 32 },
        // 4 C-Buttons yellow diamond
        { id: 'c_up', name: 'C-Up (Yellow)', label: 'C▲', color: '#eab308', textColor: '#0f172a', shape: 'c-button', cDirection: 'up', x: 110, y: 35, width: 30 },
        { id: 'c_left', name: 'C-Left (Yellow)', label: 'C◄', color: '#eab308', textColor: '#0f172a', shape: 'c-button', cDirection: 'left', x: 82, y: 63, width: 30 },
        { id: 'c_right', name: 'C-Right (Yellow)', label: 'C►', color: '#eab308', textColor: '#0f172a', shape: 'c-button', cDirection: 'right', x: 138, y: 63, width: 30 },
        { id: 'c_down', name: 'C-Down (Yellow)', label: 'C▼', color: '#eab308', textColor: '#0f172a', shape: 'c-button', cDirection: 'down', x: 110, y: 91, width: 30 }
      );

      if (isCompact) {
        if (showShoulders) {
          buttons.push(
            { id: 'n64_l', name: 'L Shoulder', label: 'L', color: '#475569', shape: 'trigger', x: 32, y: 155, width: 44, height: 22 },
            { id: 'n64_z', name: 'Z Trigger', label: 'Z', color: '#334155', shape: 'trigger', x: 85, y: 155, width: 44, height: 22 },
            { id: 'n64_r', name: 'R Shoulder', label: 'R', color: '#475569', shape: 'trigger', x: 138, y: 155, width: 44, height: 22 }
          );
          return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '5 15 160 175', width: 160, height: 175 };
        }
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '5 15 160 125', width: 160, height: 125 };
      } else {
        buttons.push(
          { id: 'n64_stick', name: 'N64 Analog Stick', label: 'STICK', color: '#64748b', shape: 'circle', x: 160, y: 110, width: 42 },
          { id: 'n64_start', name: 'Start (Red)', label: 'START', color: '#dc2626', textColor: '#ffffff', shape: 'circle', x: 160, y: 60, width: 24 },
          { id: 'dpad_up', name: 'D-Pad Up', label: '▲', color: '#1e293b', shape: 'pill', x: 60, y: 60, width: 22, height: 22 },
          { id: 'dpad_left', name: 'D-Pad Left', label: '◄', color: '#1e293b', shape: 'pill', x: 42, y: 78, width: 22, height: 22 },
          { id: 'dpad_right', name: 'D-Pad Right', label: '►', color: '#1e293b', shape: 'pill', x: 78, y: 78, width: 22, height: 22 },
          { id: 'dpad_down', name: 'D-Pad Down', label: '▼', color: '#1e293b', shape: 'pill', x: 60, y: 96, width: 22, height: 22 },
          { id: 'n64_l', name: 'L Shoulder', label: 'L', color: '#475569', shape: 'trigger', x: 60, y: 20, width: 48, height: 20 },
          { id: 'n64_z', name: 'Z Trigger', label: 'Z', color: '#334155', shape: 'pill', x: 160, y: 20, width: 40, height: 18 },
          { id: 'n64_r', name: 'R Shoulder', label: 'R', color: '#475569', shape: 'trigger', x: 260, y: 20, width: 48, height: 20 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 320 170', width: 320, height: 170 };
      }
    }

    case 'snes': {
      // SNES / Super Famicom: 4 authentic colors
      buttons.push(
        { id: 'snes_x', name: 'X Button (Blue)', label: 'X', color: '#2563eb', textColor: '#ffffff', shape: 'circle', x: 80, y: 35, width: 38 },
        { id: 'snes_y', name: 'Y Button (Green)', label: 'Y', color: '#16a34a', textColor: '#ffffff', shape: 'circle', x: 40, y: 75, width: 38 },
        { id: 'snes_a', name: 'A Button (Red)', label: 'A', color: '#dc2626', textColor: '#ffffff', shape: 'circle', x: 120, y: 75, width: 38 },
        { id: 'snes_b', name: 'B Button (Yellow)', label: 'B', color: '#ca8a04', textColor: '#ffffff', shape: 'circle', x: 80, y: 115, width: 38 }
      );
      if (isCompact) {
        if (showShoulders) {
          buttons.push(
            { id: 'snes_l', name: 'L Shoulder', label: 'L', color: '#475569', shape: 'trigger', x: 40, y: 165, width: 55, height: 22 },
            { id: 'snes_r', name: 'R Shoulder', label: 'R', color: '#475569', shape: 'trigger', x: 120, y: 165, width: 55, height: 22 },
            { id: 'snes_select', name: 'Select', label: 'SELECT', color: '#334155', shape: 'pill', x: 50, y: 198, width: 46, height: 18 },
            { id: 'snes_start', name: 'Start', label: 'START', color: '#334155', shape: 'pill', x: 110, y: 198, width: 46, height: 18 }
          );
          return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 160 220', width: 160, height: 220 };
        }
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 10 140 135', width: 140, height: 135 };
      } else {
        buttons.push(
          { id: 'dpad_up', name: 'D-Pad Up', label: '▲', color: '#1e293b', shape: 'pill', x: 60, y: 65, width: 26, height: 26 },
          { id: 'dpad_left', name: 'D-Pad Left', label: '◄', color: '#1e293b', shape: 'pill', x: 38, y: 87, width: 26, height: 26 },
          { id: 'dpad_right', name: 'D-Pad Right', label: '►', color: '#1e293b', shape: 'pill', x: 82, y: 87, width: 26, height: 26 },
          { id: 'dpad_down', name: 'D-Pad Down', label: '▼', color: '#1e293b', shape: 'pill', x: 60, y: 109, width: 26, height: 26 },
          { id: 'snes_select', name: 'Select', label: 'SELECT', color: '#334155', shape: 'pill', x: 135, y: 100, width: 44, height: 18 },
          { id: 'snes_start', name: 'Start', label: 'START', color: '#334155', shape: 'pill', x: 185, y: 100, width: 44, height: 18 },
          { id: 'snes_l', name: 'L Shoulder', label: 'L', color: '#475569', shape: 'trigger', x: 60, y: 22, width: 60, height: 20 },
          { id: 'snes_r', name: 'R Shoulder', label: 'R', color: '#475569', shape: 'trigger', x: 260, y: 22, width: 60, height: 20 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 320 160', width: 320, height: 160 };
      }
    }

    case 'gba_nds': {
      // GBA / NDS: A & B diagonal + optional X & Y
      buttons.push(
        { id: 'nds_x', name: 'X Button', label: 'X', color: '#334155', shape: 'circle', x: 80, y: 35, width: 34 },
        { id: 'nds_y', name: 'Y Button', label: 'Y', color: '#334155', shape: 'circle', x: 45, y: 68, width: 34 },
        { id: 'gba_a', name: 'A Button', label: 'A', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 120, y: 68, width: 38 },
        { id: 'gba_b', name: 'B Button', label: 'B', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 85, y: 105, width: 38 }
      );
      if (showShoulders) {
        buttons.push(
          { id: 'gba_l', name: 'L Shoulder', label: 'L', color: '#475569', shape: 'trigger', x: 40, y: 155, width: 50, height: 22 },
          { id: 'gba_r', name: 'R Shoulder', label: 'R', color: '#475569', shape: 'trigger', x: 125, y: 155, width: 50, height: 22 },
          { id: 'gba_select', name: 'Select', label: 'SEL', color: '#334155', shape: 'pill', x: 50, y: 188, width: 40, height: 16 },
          { id: 'gba_start', name: 'Start', label: 'START', color: '#334155', shape: 'pill', x: 115, y: 188, width: 44, height: 16 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 10 150 205', width: 150, height: 205 };
      }
      return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '15 15 140 135', width: 140, height: 135 };
    }

    case 'ps_classic': {
      // PS1/PS2 DualShock Classic: 4 classic colors (Cross: blue, Circle: red, Square: pink, Triangle: green)
      buttons.push(
        { id: 'triangle', name: 'Triangle (Green)', label: '△', psSymbol: 'triangle', color: '#1e293b', textColor: '#00b894', shape: 'circle', x: 80, y: 35, width: 38 },
        { id: 'square', name: 'Square (Pink)', label: '□', psSymbol: 'square', color: '#1e293b', textColor: '#fd79a8', shape: 'circle', x: 40, y: 75, width: 38 },
        { id: 'circle', name: 'Circle (Red)', label: '○', psSymbol: 'circle', color: '#1e293b', textColor: '#ff7675', shape: 'circle', x: 120, y: 75, width: 38 },
        { id: 'cross', name: 'Cross (Blue)', label: '✕', psSymbol: 'cross', color: '#1e293b', textColor: '#74b9ff', shape: 'circle', x: 80, y: 115, width: 38 }
      );
      if (showShoulders) {
        buttons.push(
          { id: 'l2', name: 'L2', label: 'L2', color: '#0f172a', shape: 'trigger', x: 35, y: 165, width: 50, height: 24 },
          { id: 'l1', name: 'L1', label: 'L1', color: '#1e293b', shape: 'pill', x: 35, y: 196, width: 50, height: 20 },
          { id: 'r2', name: 'R2', label: 'R2', color: '#0f172a', shape: 'trigger', x: 125, y: 165, width: 50, height: 24 },
          { id: 'r1', name: 'R1', label: 'R1', color: '#1e293b', shape: 'pill', x: 125, y: 196, width: 50, height: 20 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 160 220', width: 160, height: 220 };
      }
      return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 10 140 135', width: 140, height: 135 };
    }

    case 'psp_vita': {
      buttons.push(
        { id: 'triangle', name: 'Triangle', label: '△', psSymbol: 'triangle', color: '#1e293b', textColor: '#ffffff', shape: 'circle', x: 80, y: 35, width: 36 },
        { id: 'square', name: 'Square', label: '□', psSymbol: 'square', color: '#1e293b', textColor: '#ffffff', shape: 'circle', x: 42, y: 73, width: 36 },
        { id: 'circle', name: 'Circle', label: '○', psSymbol: 'circle', color: '#1e293b', textColor: '#ffffff', shape: 'circle', x: 118, y: 73, width: 36 },
        { id: 'cross', name: 'Cross', label: '✕', psSymbol: 'cross', color: '#1e293b', textColor: '#ffffff', shape: 'circle', x: 80, y: 111, width: 36 }
      );
      if (showShoulders) {
        buttons.push(
          { id: 'l1', name: 'L Button', label: 'L', color: '#334155', shape: 'trigger', x: 40, y: 160, width: 52, height: 22 },
          { id: 'r1', name: 'R Button', label: 'R', color: '#334155', shape: 'trigger', x: 120, y: 160, width: 52, height: 22 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 10 140 185', width: 140, height: 185 };
      }
      return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '15 10 130 130', width: 130, height: 130 };
    }

    case 'dreamcast': {
      // Dreamcast: A (red, bottom), B (blue, right), X (yellow, left), Y (green, top)
      buttons.push(
        { id: 'dc_y', name: 'Y Button (Green)', label: 'Y', color: '#16a34a', textColor: '#ffffff', shape: 'circle', x: 80, y: 35, width: 38 },
        { id: 'dc_x', name: 'X Button (Yellow)', label: 'X', color: '#ca8a04', textColor: '#ffffff', shape: 'circle', x: 40, y: 75, width: 38 },
        { id: 'dc_b', name: 'B Button (Blue)', label: 'B', color: '#2563eb', textColor: '#ffffff', shape: 'circle', x: 120, y: 75, width: 38 },
        { id: 'dc_a', name: 'A Button (Red)', label: 'A', color: '#dc2626', textColor: '#ffffff', shape: 'circle', x: 80, y: 115, width: 38 }
      );
      if (showShoulders) {
        buttons.push(
          { id: 'dc_l', name: 'L Trigger', label: 'LT', color: '#334155', shape: 'trigger', x: 38, y: 165, width: 52, height: 24 },
          { id: 'dc_r', name: 'R Trigger', label: 'RT', color: '#334155', shape: 'trigger', x: 122, y: 165, width: 52, height: 24 },
          { id: 'dc_start', name: 'Start (Triangle)', label: 'START', color: '#dc2626', textColor: '#ffffff', shape: 'pill', x: 80, y: 198, width: 44, height: 18 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 0 160 220', width: 160, height: 220 };
      }
      return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '10 10 140 135', width: 140, height: 135 };
    }

    case 'sega_six_button': {
      // Sega Genesis / Saturn 6-Button layout:
      // Top row: X, Y, Z
      // Bottom row: A, B, C
      buttons.push(
        { id: 'sega_x', name: 'X Button', label: 'X', color: '#334155', textColor: '#ffffff', shape: 'circle', x: 35, y: 38, width: 32 },
        { id: 'sega_y', name: 'Y Button', label: 'Y', color: '#334155', textColor: '#ffffff', shape: 'circle', x: 75, y: 38, width: 32 },
        { id: 'sega_z', name: 'Z Button', label: 'Z', color: '#334155', textColor: '#ffffff', shape: 'circle', x: 115, y: 38, width: 32 },
        { id: 'sega_a', name: 'A Button', label: 'A', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 30, y: 82, width: 38 },
        { id: 'sega_b', name: 'B Button', label: 'B', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 75, y: 82, width: 38 },
        { id: 'sega_c', name: 'C Button', label: 'C', color: '#1e293b', textColor: '#38bdf8', shape: 'circle', x: 120, y: 82, width: 38 }
      );
      if (showShoulders) {
        buttons.push(
          { id: 'sega_l', name: 'L Shoulder', label: 'L', color: '#475569', shape: 'trigger', x: 35, y: 132, width: 50, height: 22 },
          { id: 'sega_r', name: 'R Shoulder', label: 'R', color: '#475569', shape: 'trigger', x: 115, y: 132, width: 50, height: 22 },
          { id: 'sega_start', name: 'Start', label: 'START', color: '#334155', shape: 'pill', x: 75, y: 132, width: 44, height: 18 }
        );
        return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '0 10 150 160', width: 150, height: 160 };
      }
      return { buttons: enrichSubLabels(buttons, layoutId, physicalLayout), viewBox: '5 15 140 100', width: 140, height: 100 };
    }

    default:
      return { buttons: [], viewBox: '0 0 100 100', width: 100, height: 100 };
  }
}

function enrichSubLabels(buttons: LayoutButtonInfo[], layoutId: ConsoleLayoutId, physical: PhysicalControllerType): LayoutButtonInfo[] {
  return buttons.map((btn) => ({
    ...btn,
    subLabel: getSubLabel(layoutId, btn.id, physical),
  }));
}
