const fs = require('fs');
const filePath = 'd:/Controller Button Overlay/src/shared/defaultConfigs.ts';
let content = fs.readFileSync(filePath, 'utf8');

const targetBlock = `export const THEME_PRESETS = {
  original: {
    name: 'Original Console Colors',
    description: 'Chính xác bảng màu nguyên bản của từng hệ máy',
  },
  minimal_white: {
    name: 'Minimal White',
    description: 'Giao diện tối giản trắng xám tinh tế, viền mỏng',
    colors: {
      primary: '#ffffff',
      background: 'rgba(20, 20, 25, 0.85)',
      border: '#ffffff',
      text: '#ffffff',
      pressedGlow: '#38bdf8',
    },
  },
  dark_matte: {
    name: 'Dark Matte Stealth',
    description: 'Tone xám đen mờ tàng hình không làm xao nhãng mắt',
    colors: {
      primary: '#94a3b8',
      background: 'rgba(10, 10, 14, 0.92)',
      border: '#334155',
      text: '#e2e8f0',
      pressedGlow: '#a855f7',
    },
  },
  neon_cyber: {
    name: 'Neon Cyberpunk',
    description: 'Tone màu dạ quang cyberpunk nổi bật rực rỡ',
    colors: {
      primary: '#06b6d4',
      background: 'rgba(15, 23, 42, 0.95)',
      border: '#ec4899',
      text: '#f43f5e',
      pressedGlow: '#06b6d4',
    },
  },
};`;

// Find where export const THEME_PRESETS starts and replace until the end
const idx = content.indexOf('export const THEME_PRESETS');
if (idx !== -1) {
  content = content.slice(0, idx) + targetBlock + '\n';
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated THEME_PRESETS with proper UTF-8 Vietnamese strings!');
} else {
  console.log('THEME_PRESETS not found!');
}
