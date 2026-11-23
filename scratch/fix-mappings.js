const fs = require('fs');
const path = require('path');

// Reconstruct default mapping logic from src/shared/defaultMappings.ts
function getDefaultMappingForLayout(layout) {
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
        capture: { type: 'button', index: 16 },
        home: { type: 'button', index: 16 },
        ls: { type: 'button', index: 10 },
        rs: { type: 'button', index: 11 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
      };
    case 'gamecube':
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
      };
    case 'n64':
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
      return {
        sega_a: { type: 'button', index: 0 },
        sega_b: { type: 'button', index: 1 },
        sega_c: { type: 'button', index: 5 },
        sega_x: { type: 'button', index: 2 },
        sega_y: { type: 'button', index: 3 },
        sega_z: { type: 'button', index: 4 },
        sega_start: { type: 'button', index: 9 },
        sega_mode: { type: 'button', index: 8 },
        dpad_up: { type: 'button', index: 12 },
        dpad_down: { type: 'button', index: 13 },
        dpad_left: { type: 'button', index: 14 },
        dpad_right: { type: 'button', index: 15 },
      };
    default:
      return {};
  }
}

const configPath = path.join(process.env.APPDATA, 'tsuglyph', 'config.json');
if (fs.existsSync(configPath)) {
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  cfg.profiles.forEach(pr => {
    pr.customMapping = getDefaultMappingForLayout(pr.layout);
  });
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2), 'utf8');
  console.log('Fixed all customMappings in config.json successfully!');
}
