import React from 'react';
import { useConfig } from '../hooks/useConfig';
import { Maximize2, Move, Compass, CornerUpLeft, CornerUpRight, CornerDownLeft, CornerDownRight, Disc } from 'lucide-react';

export const TransformTab: React.FC = () => {
  const { activeProfile, updateActiveProfile, setPosition } = useConfig();

  if (!activeProfile) return null;

  const handleSnap = (position: 'tl' | 'tr' | 'bl' | 'br' | 'center') => {
    const screenW = window.screen.availWidth || 1920;
    const screenH = window.screen.availHeight || 1080;
    const margin = 40;

    let targetX = 0;
    let targetY = 0;

    switch (position) {
      case 'tl':
        targetX = margin;
        targetY = margin;
        break;
      case 'tr':
        targetX = screenW - 220;
        targetY = margin;
        break;
      case 'bl':
        targetX = margin;
        targetY = screenH - 260;
        break;
      case 'br':
        targetX = screenW - 220;
        targetY = screenH - 260;
        break;
      case 'center':
        targetX = Math.round(screenW / 2 - 100);
        targetY = Math.round(screenH / 2 - 100);
        break;
    }

    setPosition({ x: targetX, y: targetY });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Vị trí & Kích thước Overlay</h3>
        <p className="text-xs text-slate-400">
          Tùy chỉnh tỷ lệ phóng to/thu nhỏ, độ trong suốt và tọa độ hiển thị trên màn hình game
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scale (50% - 250%) */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-blue-400" />
              Kích thước (Scale)
            </span>
            <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
              {Math.round(activeProfile.scale * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={activeProfile.scale}
            onChange={(e) => updateActiveProfile({ scale: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>50%</span>
            <span>100% (Chuẩn)</span>
            <span>250% (Rất to)</span>
          </div>
        </div>

        {/* Opacity (10% - 100%) */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-400" />
              Độ mờ (Opacity)
            </span>
            <span className="font-mono text-xs font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              {Math.round(activeProfile.opacity * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={activeProfile.opacity}
            onChange={(e) => updateActiveProfile({ opacity: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10% (Trong suốt)</span>
            <span>50%</span>
            <span>100% (Đậm nét)</span>
          </div>
        </div>
      </div>

      {/* Position Coordinates & Snap */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Move className="w-4 h-4 text-emerald-400" />
              Tọa độ Vị trí (X / Y)
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Bạn có thể kéo thả trực tiếp bằng chuột khi tắt Khóa (Ctrl+Shift+L) hoặc nhập pixel ở đây
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold">X:</span>
              <input
                type="number"
                value={activeProfile.position.x}
                onChange={(e) =>
                  setPosition({
                    x: parseInt(e.target.value) || 0,
                    y: activeProfile.position.y,
                  })
                }
                className="w-16 bg-transparent text-xs font-mono text-white text-right focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">px</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold">Y:</span>
              <input
                type="number"
                value={activeProfile.position.y}
                onChange={(e) =>
                  setPosition({
                    x: activeProfile.position.x,
                    y: parseInt(e.target.value) || 0,
                  })
                }
                className="w-16 bg-transparent text-xs font-mono text-white text-right focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">px</span>
            </div>
          </div>
        </div>

        {/* Quick Snap Grid */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-300 mb-2">Đặt nhanh vào 4 góc màn hình:</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => handleSnap('tl')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors border border-slate-700"
            >
              <CornerUpLeft className="w-3.5 h-3.5 text-blue-400" />
              <span>Góc Trên - Trái</span>
            </button>
            <button
              type="button"
              onClick={() => handleSnap('tr')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors border border-slate-700"
            >
              <CornerUpRight className="w-3.5 h-3.5 text-blue-400" />
              <span>Góc Trên - Phải</span>
            </button>
            <button
              type="button"
              onClick={() => handleSnap('center')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors border border-slate-700"
            >
              <Disc className="w-3.5 h-3.5 text-purple-400" />
              <span>Chính giữa</span>
            </button>
            <button
              type="button"
              onClick={() => handleSnap('bl')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors border border-slate-700"
            >
              <CornerDownLeft className="w-3.5 h-3.5 text-blue-400" />
              <span>Góc Dưới - Trái</span>
            </button>
            <button
              type="button"
              onClick={() => handleSnap('br')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors border border-slate-700"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-blue-400" />
              <span>Góc Dưới - Phải</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
