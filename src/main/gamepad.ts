/**
 * Native XInput gamepad polling for Windows.
 * Uses koffi (pure-JS FFI, zero overhead) to call Windows xinput1_4.dll / xinput1_3.dll.
 * This runs in Node.js Main process and captures gamepad input even when games are focused!
 */

import { GamepadState } from '../shared/types';

// XInput bitmasks -> Chromium Gamepad API standard button indices
// 0=A, 1=B, 2=X, 3=Y, 4=LB, 5=RB, 6=LT, 7=RT, 8=BACK, 9=START, 10=L3, 11=R3, 12=UP, 13=DOWN, 14=LEFT, 15=RIGHT
const BUTTON_MAP: { bit: number; index: number }[] = [
  { bit: 0x1000, index: 0 },  // A
  { bit: 0x2000, index: 1 },  // B
  { bit: 0x4000, index: 2 },  // X
  { bit: 0x8000, index: 3 },  // Y
  { bit: 0x0100, index: 4 },  // LB
  { bit: 0x0200, index: 5 },  // RB
  { bit: 0x0020, index: 8 },  // BACK / View / Select
  { bit: 0x0010, index: 9 },  // START / Menu
  { bit: 0x0040, index: 10 }, // L3 / Left Stick Click
  { bit: 0x0080, index: 11 }, // R3 / Right Stick Click
  { bit: 0x0001, index: 12 }, // DPAD_UP
  { bit: 0x0002, index: 13 }, // DPAD_DOWN
  { bit: 0x0004, index: 14 }, // DPAD_LEFT
  { bit: 0x0008, index: 15 }, // DPAD_RIGHT
];

const TOTAL_BUTTONS = 17;

let XInputGetState: ((controllerIndex: number, state: object) => number) | null = null;
let XINPUT_STATE: any = null;
let isInitAttempted = false;
let isAvailable = false;

function initXInput(): boolean {
  if (isInitAttempted) return isAvailable;
  isInitAttempted = true;

  if (process.platform !== 'win32') return false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const koffi = require('koffi');

    const XINPUT_GAMEPAD = koffi.struct('XINPUT_GAMEPAD', {
      wButtons: 'uint16',
      bLeftTrigger: 'uint8',
      bRightTrigger: 'uint8',
      sThumbLX: 'int16',
      sThumbLY: 'int16',
      sThumbRX: 'int16',
      sThumbRY: 'int16',
    });

    XINPUT_STATE = koffi.struct('XINPUT_STATE', {
      dwPacketNumber: 'uint32',
      Gamepad: XINPUT_GAMEPAD,
    });

    let lib: any = null;
    for (const dll of ['xinput1_4.dll', 'xinput1_3.dll', 'xinput9_1_0.dll']) {
      try {
        lib = koffi.load(dll);
        break;
      } catch {
        // try next fallback DLL
      }
    }

    if (!lib) {
      console.warn('[Gamepad] Could not load XInput DLL');
      return false;
    }

    XInputGetState = lib.func('XInputGetState', 'uint32', ['uint32', koffi.out(koffi.pointer(XINPUT_STATE))]);
    isAvailable = true;
    return true;
  } catch (err) {
    console.warn('[Gamepad] XInput native init failed:', err);
    return false;
  }
}

export function pollXInput(controllerIndex = 0): GamepadState {
  const emptyState: GamepadState = {
    connected: false,
    id: '',
    buttons: [],
    buttonValues: [],
    axes: [],
  };

  if (!isAvailable && !initXInput()) {
    return emptyState;
  }

  if (!XInputGetState || !XINPUT_STATE) {
    return emptyState;
  }

  try {
    const stateObj = [{}];
    const ret: number = XInputGetState(controllerIndex, stateObj);

    // ERROR_SUCCESS = 0
    if (ret !== 0) {
      return emptyState;
    }

    const gp = (stateObj[0] as any).Gamepad;

    const buttons = new Array(TOTAL_BUTTONS).fill(false);
    const buttonValues = new Array(TOTAL_BUTTONS).fill(0);

    // Map digital buttons
    for (const { bit, index } of BUTTON_MAP) {
      const pressed = (gp.wButtons & bit) !== 0;
      buttons[index] = pressed;
      buttonValues[index] = pressed ? 1 : 0;
    }

    // Map triggers (0-255 -> 0.0-1.0)
    const lt = gp.bLeftTrigger / 255;
    const rt = gp.bRightTrigger / 255;
    buttons[6] = lt > 0.1;
    buttonValues[6] = lt;
    buttons[7] = rt > 0.1;
    buttonValues[7] = rt;

    // Map Thumbsticks (-32768..32767 -> -1.0..1.0)
    const norm = (v: number) => Math.max(-1, Math.min(1, v / 32767));
    const axes = [
      norm(gp.sThumbLX),
      -norm(gp.sThumbLY), // invert Y for standard gamepad convention
      norm(gp.sThumbRX),
      -norm(gp.sThumbRY),
    ];

    return {
      connected: true,
      id: `Xbox / XInput Controller ${controllerIndex + 1}`,
      buttons,
      buttonValues,
      axes,
    };
  } catch {
    return emptyState;
  }
}
