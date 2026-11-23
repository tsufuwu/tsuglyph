import React from 'react';
import { useConfig } from '../hooks/useConfig';
import { ConsoleLayoutId, PhysicalControllerType } from '../../shared/types';
import { getDefaultMappingForLayout } from '../../shared/defaultMappings';
import { Sliders, Monitor, Sparkles, BookOpen, ToggleLeft, ToggleRight, Layers, Settings2 } from 'lucide-react';

interface ConsoleOption {
  id: ConsoleLayoutId;
  name: string;
  category: 'modern' | 'nintendo' | 'ps_sega';
  subtitle: string;
  tags: string[];
}

const CONSOLES: ConsoleOption[] = [
  // Modern
  {
    id: 'dualsense',
    name: 'PlayStation DualSense / PS4',
    category: 'modern',
    subtitle: 'Ký hiệu hình học ✕, ○, □, △ & Nút vai L1/L2, R1/R2',
    tags: ['ApexSense', 'PC Port', 'Steam'],
  },
  {
    id: 'xbox',
    name: 'Xbox Series / 360',
    category: 'modern',
    subtitle: 'Bố cục 4 màu A, B, X, Y & Cần lệch chuẩn PC',
    tags: ['XInput', 'Game Pass'],
  },
  {
    id: 'switch',
    name: 'Nintendo Switch Pro',
    category: 'modern',
    subtitle: 'Vị trí đảo B/A và Y/X kinh điển của Nintendo',
    tags: ['Ryujinx', 'Yuzu', 'Switch'],
  },

  // Nintendo Emulators
  {
    id: 'gamecube',
    name: 'GameCube (Dolphin)',
    category: 'nintendo',
    subtitle: 'Nút A tròn to xanh lá, B đỏ nhỏ, X/Y hạt đậu, Z tím',
    tags: ['Dolphin', 'Smash Melee', 'Zelda WW'],
  },
  {
    id: 'n64',
    name: 'Nintendo 64',
    category: 'nintendo',
    subtitle: 'Nút A xanh dương, B xanh lá, cụm 4 nút C vàng',
    tags: ['Project64', 'RetroArch', 'Mario 64'],
  },
  {
    id: 'snes',
    name: 'SNES / Super Famicom',
    category: 'nintendo',
    subtitle: '4 màu sắc kinh điển A, B, X, Y & Nút vai L/R',
    tags: ['Snes9x', 'Mesen', 'RetroArch'],
  },
  {
    id: 'gba_nds',
    name: 'Game Boy Advance / NDS',
    category: 'nintendo',
    subtitle: 'Cặp nút A/B chéo truyền thống và vai L/R',
    tags: ['mGBA', 'melonDS', 'DeSmuME'],
  },

  // PlayStation & Sega Emulators
  {
    id: 'ps_classic',
    name: 'PlayStation 1 & 2 (DualShock)',
    category: 'ps_sega',
    subtitle: '4 biểu tượng 4 màu gốc (Xanh dương, Đỏ, Hồng, Xanh lá)',
    tags: ['DuckStation', 'PCSX2', 'RPCS3'],
  },
  {
    id: 'psp_vita',
    name: 'PSP / PS Vita',
    category: 'ps_sega',
    subtitle: 'Ký hiệu PlayStation hiện đại & vai trong suốt',
    tags: ['PPSSPP', 'Vita3K'],
  },
  {
    id: 'dreamcast',
    name: 'Sega Dreamcast',
    category: 'ps_sega',
    subtitle: 'Bố cục A(Đỏ), B(Xanh), X(Vàng), Y(Lục) chuẩn Sega',
    tags: ['Flycast', 'Redream'],
  },
  {
    id: 'sega_six_button',
    name: 'Sega Genesis / Saturn (6-Button)',
    category: 'ps_sega',
    subtitle: '2 hàng 6 nút mặt: X/Y/Z phía trên và A/B/C phía dưới',
    tags: ['Đối kháng', 'Street Fighter', 'Saturn'],
  },
];

export const LayoutTab: React.FC = () => {
  const { activeProfile, updateActiveProfile, config, saveConfig } = useConfig();

  if (!activeProfile) return null;

  const handleSelectLayout = (layoutId: ConsoleLayoutId) => {
    updateActiveProfile({
      layout: layoutId,
      customMapping: getDefaultMappingForLayout(layoutId),
    });
  };

  return (
    <div className="space-y-6">
      {/* Category: 11 Consoles Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Chọn Hệ máy Game (Console Layout)</h3>
          <p className="text-xs text-slate-400">
            Bất kể tay cầm cắm vào là gì, chọn layout hệ máy bạn đang chơi để hiển thị đúng ký hiệu game
          </p>
        </div>

        {/* Modern */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            Nhóm Hiện đại (Modern PC & Consoles)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CONSOLES.filter((c) => c.category === 'modern').map((c) => (
              <LayoutCard
                key={c.id}
                consoleOption={c}
                isSelected={activeProfile.layout === c.id}
                onSelect={() => handleSelectLayout(c.id)}
              />
            ))}
          </div>
        </div>

        {/* Nintendo Emulators */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
            Nhóm Giả lập Nintendo (Dolphin, N64, SNES...)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {CONSOLES.filter((c) => c.category === 'nintendo').map((c) => (
              <LayoutCard
                key={c.id}
                consoleOption={c}
                isSelected={activeProfile.layout === c.id}
                onSelect={() => handleSelectLayout(c.id)}
              />
            ))}
          </div>
        </div>

        {/* PS & Sega Emulators */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
            Nhóm Giả lập PlayStation & Sega
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {CONSOLES.filter((c) => c.category === 'ps_sega').map((c) => (
              <LayoutCard
                key={c.id}
                consoleOption={c}
                isSelected={activeProfile.layout === c.id}
                onSelect={() => handleSelectLayout(c.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Display Modes & Memorization Settings */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Chế độ hiển thị & Tính năng Ghi nhớ</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Compact vs Full Mode */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-200">Kiểu hiển thị (Display Mode)</div>
              <div className="text-xs text-slate-400">
                {activeProfile.displayMode === 'compact'
                  ? 'Gọn gàng (Chỉ cụm nút mặt chính)'
                  : 'Đầy đủ (Toàn bộ D-pad, Analog, nút giữa)'}
              </div>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => updateActiveProfile({ displayMode: 'compact' })}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeProfile.displayMode === 'compact'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gọn gàng
              </button>
              <button
                type="button"
                onClick={() => updateActiveProfile({ displayMode: 'full' })}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeProfile.displayMode === 'full'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Đầy đủ
              </button>
            </div>
          </div>

          {/* Shoulders / Triggers Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-200">Hiện nút vai (Shoulder / Triggers)</div>
              <div className="text-xs text-slate-400">Hiển thị thêm hàng nút L1/R1, L2/R2, LT/RT</div>
            </div>
            <button
              type="button"
              onClick={() => updateActiveProfile({ showShoulders: !activeProfile.showShoulders })}
              className={`p-1.5 rounded-lg border transition-colors ${
                activeProfile.showShoulders
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {activeProfile.showShoulders ? (
                <ToggleRight className="w-6 h-6" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Dual-Label Mode */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Chế độ 2 Nhãn (Dual-Label Mode)</span>
              </div>
              <div className="text-xs text-slate-400">
                Hiện thêm nhãn nhỏ phím Xbox thật (ví dụ: chữ Y nhỏ ở góc △) để luyện phản xạ
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateActiveProfile({ dualLabelEnabled: !activeProfile.dualLabelEnabled })}
              className={`p-1.5 rounded-lg border transition-colors ${
                activeProfile.dualLabelEnabled
                  ? 'bg-amber-600/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {activeProfile.dualLabelEnabled ? (
                <ToggleRight className="w-6 h-6" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Static Cheat-Sheet Mode */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Sơ đồ tĩnh (Static Cheat-Sheet Mode)</span>
              </div>
              <div className="text-xs text-slate-400">
                Chỉ hiện bảng tra cứu tĩnh, tắt hiệu ứng sáng khi nhấn nút
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateActiveProfile({ staticCheatSheet: !activeProfile.staticCheatSheet })}
              className={`p-1.5 rounded-lg border transition-colors ${
                activeProfile.staticCheatSheet
                  ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {activeProfile.staticCheatSheet ? (
                <ToggleRight className="w-6 h-6" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* showPhysicalLayoutBelow Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Hiện Layout Tay cầm vật lý (bên dưới)</span>
              </div>
              <div className="text-xs text-slate-400">
                Hiển thị thêm sơ đồ Xbox/XInput tách biệt phía dưới layout game — mặc định TẮT
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateActiveProfile({ showPhysicalLayoutBelow: !activeProfile.showPhysicalLayoutBelow })}
              className={`p-1.5 rounded-lg border transition-colors ${
                activeProfile.showPhysicalLayoutBelow
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {activeProfile.showPhysicalLayoutBelow ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            </button>
          </div>

          {/* startWithOverlayOnly Toggle (app-level) */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-800/40 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                <Settings2 className="w-4 h-4 text-amber-400" />
                <span>Chỉ hiện overlay nút ở lần mở tiếp theo</span>
              </div>
              <div className="text-xs text-slate-400">
                Khi bật: lần sau khởi động sẽ chỉ hiện overlay mà không mở cửa sổ Cài đặt. Mặc định TẮT (mở Settings trước).
              </div>
            </div>
            <button
              type="button"
              onClick={() => saveConfig({ ...config, startWithOverlayOnly: !config.startWithOverlayOnly })}
              className={`p-1.5 rounded-lg border transition-colors ${
                config.startWithOverlayOnly
                  ? 'bg-amber-600/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {config.startWithOverlayOnly ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LayoutCard: React.FC<{
  consoleOption: ConsoleOption;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ consoleOption, isSelected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="font-semibold text-xs text-white">{consoleOption.name}</div>
          {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
        </div>
        <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {consoleOption.subtitle}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {consoleOption.tags.map((t) => (
          <span
            key={t}
            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono"
          >
            {t}
          </span>
        ))}
      </div>
    </button>
  );
};
