import { ConsoleLayoutId, CustomMapping } from './types';

/**
 * Standard Gamepad API Button Indices (Standard Gamepad / XInput):
 * 0: Bottom face button (Xbox A / PS Cross / Switch B)
 * 1: Right face button (Xbox B / PS Circle / Switch A)
 * 2: Left face button (Xbox X / PS Square / Switch Y)
 * 3: Top face button (Xbox Y / PS Triangle / Switch X)
 * 4: Left shoulder (LB / L1 / L)
 * 5: Right shoulder (RB / R1 / R)
 * 6: Left trigger (LT / L2 / ZL)
 * 7: Right trigger (RT / R2 / ZR)
 * 8: Select / Back / View / Share / Minus
 * 9: Start / Menu / Options / Plus
 * 10: Left stick press (L3)
 * 11: Right stick press (R3)
 * 12: D-Pad Up
 * 13: D-Pad Down
 * 14: D-Pad Left
 * 15: D-Pad Right
 * 16: Center / Home / Guide
 *
 * Axes:
 * 0: Left Stick X (-1 Left, +1 Right)
 * 1: Left Stick Y (-1 Up, +1 Down)
 * 2: Right Stick X (-1 Left, +1 Right)
 * 3: Right Stick Y (-1 Up, +1 Down)
 */

export function getDefaultMappingForLayout(layout: ConsoleLayoutId): CustomMapping {
  switch (layout) {
    case 'dualsense':
    case 'ps_classic':
    case 'psp_vita':
      return {
        cross: { type: 'button', index: 0 },
        circle: { type: 'button', index: 1 },
        square: { type: 'button', index: 2 },
        triangle: { type: 'button', index: 3 },
        l1: { type: 'button', index: 4 },
        r1: { type: 'button', index: 5 },
        l2: { type: 'button', index: 6 },
        r2: { type: 'button', index: 7 },
        share: { type: 'button', index: 8 },
        options: { type: 'button', index: 9 },
        l3: { type: 'button', index: 10 },
        r3: { type: 'button', index: 11 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
        touchpad: { type: 'button', index: 16 },
      };

    case 'xbox':
      return {
        a: { type: 'button', index: 0 },
        b: { type: 'button', index: 1 },
        x: { type: 'button', index: 2 },
        y: { type: 'button', index: 3 },
        lb: { type: 'button', index: 4 },
        rb: { type: 'button', index: 5 },
        lt: { type: 'button', index: 6 },
        rt: { type: 'button', index: 7 },
        view: { type: 'button', index: 8 },
        menu: { type: 'button', index: 9 },
        ls: { type: 'button', index: 10 },
        rs: { type: 'button', index: 11 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
        guide: { type: 'button', index: 16 },
      };

    case 'switch':
      // Switch has B at bottom, A at right, Y at left, X at top
      // When playing on physical Xbox controller:
      // Xbox A (0) is physically at bottom -> maps to Switch B
      // Xbox B (1) is physically at right -> maps to Switch A
      // Xbox X (2) is physically at left -> maps to Switch Y
      // Xbox Y (3) is physically at top -> maps to Switch X
      return {
        b: { type: 'button', index: 0 },
        a: { type: 'button', index: 1 },
        y: { type: 'button', index: 2 },
        x: { type: 'button', index: 3 },
        l: { type: 'button', index: 4 },
        r: { type: 'button', index: 5 },
        zl: { type: 'button', index: 6 },
        zr: { type: 'button', index: 7 },
        minus: { type: 'button', index: 8 },
        plus: { type: 'button', index: 9 },
        l3: { type: 'button', index: 10 },
        r3: { type: 'button', index: 11 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
        capture: { type: 'button', index: 16 },
      };

    case 'gamecube':
      // GameCube:
      // Center giant A -> Xbox A (0)
      // Small red B -> Xbox X (2) or B (1). Standard Dolphin default: GC A -> Pad A (0), GC B -> Pad X (2), GC X -> Pad B (1), GC Y -> Pad Y (3)
      // Purple Z trigger -> RB (5) or RT (7)
      // L/R analog triggers -> LT (6), RT (7)
      // Start -> Button 9
      return {
        gc_a: { type: 'button', index: 0 },
        gc_b: { type: 'button', index: 2 },
        gc_x: { type: 'button', index: 1 },
        gc_y: { type: 'button', index: 3 },
        gc_z: { type: 'button', index: 5 },
        gc_l: { type: 'button', index: 6 },
        gc_r: { type: 'button', index: 7 },
        gc_start: { type: 'button', index: 9 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
        c_stick_up: { type: 'axis', index: 3, direction: 'negative' },
        c_stick_down: { type: 'axis', index: 3, direction: 'positive' },
        c_stick_left: { type: 'axis', index: 2, direction: 'negative' },
        c_stick_right: { type: 'axis', index: 2, direction: 'positive' },
      };

    case 'n64':
      // N64 Layout:
      // Blue A -> Xbox A (0)
      // Green B -> Xbox X (2)
      // 4 Yellow C-Buttons -> Right Stick directions!
      // C-Up: Right Stick Up (Axis 3 neg)
      // C-Down: Right Stick Down (Axis 3 pos)
      // C-Left: Right Stick Left (Axis 2 neg)
      // C-Right: Right Stick Right (Axis 2 pos)
      // Z trigger -> Left Trigger (6)
      // L/R -> Left Bumper (4), Right Bumper (5)
      // Start -> Menu (9)
      return {
        n64_a: { type: 'button', index: 0 },
        n64_b: { type: 'button', index: 2 },
        c_up: { type: 'axis', index: 3, direction: 'negative' },
        c_down: { type: 'axis', index: 3, direction: 'positive' },
        c_left: { type: 'axis', index: 2, direction: 'negative' },
        c_right: { type: 'axis', index: 2, direction: 'positive' },
        n64_l: { type: 'button', index: 4 },
        n64_r: { type: 'button', index: 5 },
        n64_z: { type: 'button', index: 6 },
        n64_start: { type: 'button', index: 9 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
      };

    case 'snes':
      // SNES: B bottom, A right, Y left, X top
      return {
        snes_b: { type: 'button', index: 0 },
        snes_a: { type: 'button', index: 1 },
        snes_y: { type: 'button', index: 2 },
        snes_x: { type: 'button', index: 3 },
        snes_l: { type: 'button', index: 4 },
        snes_r: { type: 'button', index: 5 },
        snes_select: { type: 'button', index: 8 },
        snes_start: { type: 'button', index: 9 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
      };

    case 'gba_nds':
      return {
        gba_b: { type: 'button', index: 0 },
        gba_a: { type: 'button', index: 1 },
        nds_y: { type: 'button', index: 2 },
        nds_x: { type: 'button', index: 3 },
        gba_l: { type: 'button', index: 4 },
        gba_r: { type: 'button', index: 5 },
        gba_select: { type: 'button', index: 8 },
        gba_start: { type: 'button', index: 9 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
      };

    case 'dreamcast':
      // Dreamcast: A bottom (red), B right (blue), X left (yellow), Y top (green)
      return {
        dc_a: { type: 'button', index: 0 },
        dc_b: { type: 'button', index: 1 },
        dc_x: { type: 'button', index: 2 },
        dc_y: { type: 'button', index: 3 },
        dc_l: { type: 'button', index: 6 },
        dc_r: { type: 'button', index: 7 },
        dc_start: { type: 'button', index: 9 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
      };

    case 'sega_six_button':
      // 6-Button Arcade / Genesis / Saturn:
      // Bottom row: A (0), B (1), C (5 - RB)
      // Top row: X (2), Y (3), Z (4 - LB)
      return {
        sega_a: { type: 'button', index: 0 },
        sega_b: { type: 'button', index: 1 },
        sega_c: { type: 'button', index: 5 },
        sega_x: { type: 'button', index: 2 },
        sega_y: { type: 'button', index: 3 },
        sega_z: { type: 'button', index: 4 },
        sega_l: { type: 'button', index: 6 },
        sega_r: { type: 'button', index: 7 },
        sega_mode: { type: 'button', index: 8 },
        sega_start: { type: 'button', index: 9 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
      };

    default:
      return {};
  }
}
