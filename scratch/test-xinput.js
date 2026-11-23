const koffi = require('koffi');
console.log('Testing XInput DLL...');

for (const dll of ['xinput1_4.dll', 'xinput1_3.dll', 'xinput9_1_0.dll']) {
  try {
    const lib = koffi.load(dll);
    console.log('Successfully loaded:', dll);
    const XINPUT_GAMEPAD = koffi.struct('XINPUT_GAMEPAD', {
      wButtons: 'uint16',
      bLeftTrigger: 'uint8',
      bRightTrigger: 'uint8',
      sThumbLX: 'int16',
      sThumbLY: 'int16',
      sThumbRX: 'int16',
      sThumbRY: 'int16',
    });
    const XINPUT_STATE = koffi.struct('XINPUT_STATE', {
      dwPacketNumber: 'uint32',
      Gamepad: XINPUT_GAMEPAD,
    });
    const XInputGetState = lib.func('XInputGetState', 'uint32', ['uint32', koffi.out(koffi.pointer(XINPUT_STATE))]);
    
    for (let i = 0; i < 4; i++) {
      const stateObj = [{}];
      const res = XInputGetState(i, stateObj);
      console.log(`Controller ${i} result:`, res, res === 0 ? 'CONNECTED!' : 'Not connected');
      if (res === 0) {
        console.log('State:', JSON.stringify(stateObj[0]));
      }
    }
    break;
  } catch (err) {
    console.log('Failed to load', dll, err.message);
  }
}
