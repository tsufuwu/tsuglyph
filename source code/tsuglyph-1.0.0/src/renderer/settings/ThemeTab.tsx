import React from 'react';
import { useConfig } from '../hooks/useConfig';
import { THEME_PRESETS } from '../../shared/defaultConfigs';
import { Palette, Check } from 'lucide-react';
import { ThemeColors } from '../../shared/types';

export const ThemeTab: React.FC = () => {
  const { activeProfile, updateActiveProfile } = useConfig();

  if (!activeProfile) return null;

  const currentThemeId = activeProfile.theme.id;
  const customColors: ThemeColors = activeProfile.theme.customColors || {
    primary: '#3b82f6',
    background: '#181b24',
    border: '#52525b',
    text: '#ffffff',
    pressedGlow: '#60a5fa',
  };

  const handleSelectPreset = (id: keyof typeof THEME_PRESETS) => {
    const preset = THEME_PRESETS[id];
    updateActiveProfile({
      theme: {
        id,
        customColors: 'colors' in preset ? preset.colors : undefined,
      },
    });
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    updateActiveProfile({
      theme: {
        id: 'custom',
        customColors: {
          ...customColors,
          [key]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Màu sắc & Giao diện (Theme)</h3>
        <p className="text-xs text-slate-400">
          Lựa chọn bảng màu đặc trưng hoặc tùy biến màu sắc từng chi tiết nút bấm
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(THEME_PRESETS) as Array<keyof typeof THEME_PRESETS>).map((presetId) => {
          const preset = THEME_PRESETS[presetId];
          const isSelected = currentThemeId === presetId;

          return (
            <button
              key={presetId}
              type="button"
              onClick={() => handleSelectPreset(presetId)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-white">{preset.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{preset.description}</p>
            </button>
          );
        })}
      </div>

      {/* Custom Color Pickers */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-200">
            Tùy biến chi tiết (Custom Palette)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <ColorInput
            label="Màu nền nút"
            value={customColors.background}
            onChange={(c) => handleColorChange('background', c)}
          />
          <ColorInput
            label="Màu viền nút"
            value={customColors.border}
            onChange={(c) => handleColorChange('border', c)}
          />
          <ColorInput
            label="Màu chữ / Biểu tượng"
            value={customColors.text}
            onChange={(c) => handleColorChange('text', c)}
          />
          <ColorInput
            label="Màu phát sáng khi nhấn (Glow)"
            value={customColors.pressedGlow}
            onChange={(c) => handleColorChange('pressedGlow', c)}
          />
          <ColorInput
            label="Màu chủ đạo (Primary)"
            value={customColors.primary}
            onChange={(c) => handleColorChange('primary', c)}
          />
        </div>
      </div>
    </div>
  );
};

const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] text-slate-400 font-medium">{label}</div>
      <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
        <input
          type="color"
          value={value.startsWith('#') ? value : '#3b82f6'}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-xs font-mono text-slate-200 w-full focus:outline-none"
        />
      </div>
    </div>
  );
};
