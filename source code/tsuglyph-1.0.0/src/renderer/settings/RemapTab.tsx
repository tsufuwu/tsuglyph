import React, { useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useGamepad } from '../hooks/useGamepad';
import { ConsoleLayoutView } from '../layouts/ConsoleLayoutView';
import { getDefaultMappingForLayout } from '../../shared/defaultMappings';
import { ButtonMappingTarget } from '../../shared/types';
import {
  Gamepad2,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export const RemapTab: React.FC = () => {
  const { activeProfile, updateActiveProfile } = useConfig();
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null);

  const { activeButtons, gamepadInfo } = useGamepad({
    mapping: activeProfile ? activeProfile.customMapping : {},
    isRemapping: !!selectedButtonId,
    onRemapDetected: (detectedTarget: ButtonMappingTarget) => {
      if (!selectedButtonId || !activeProfile) return;

      const updatedMapping = {
        ...activeProfile.customMapping,
        [selectedButtonId]: detectedTarget,
      };

      updateActiveProfile({ customMapping: updatedMapping });
      setSelectedButtonId(null);
    },
  });

  if (!activeProfile) return null;

  const handleResetDefault = () => {
    if (confirm(`Khôi phục mapping mặc định cho layout ${activeProfile.layout}?`)) {
      updateActiveProfile({
        customMapping: getDefaultMappingForLayout(activeProfile.layout),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Gamepad Connection Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg border ${
              gamepadInfo.connected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span>Trạng thái Tay cầm:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  gamepadInfo.connected
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {gamepadInfo.connected ? 'Đã kết nối' : 'Chưa nhận diện tay cầm'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {gamepadInfo.connected
                ? `${gamepadInfo.id} (${gamepadInfo.buttonCount} nút, ${gamepadInfo.axesCount} trục analog)`
                : 'Hãy cắm hoặc bấm một nút bất kỳ trên tay cầm vật lý để kích hoạt Web Gamepad API'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetDefault}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại Mặc định</span>
        </button>
      </div>

      {/* Interactive Remap Diagram */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center relative min-h-[260px]">
        <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-400" />
          <span>
            Bấm chuột vào bất kỳ nút nào dưới đây để bắt đầu gán lại phím trên tay cầm thật của bạn
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 backdrop-blur shadow-inner">
          <ConsoleLayoutView
            layoutId={activeProfile.layout}
            isCompact={activeProfile.displayMode === 'compact'}
            showShoulders={activeProfile.showShoulders}
            dualLabelEnabled={activeProfile.dualLabelEnabled}
            physicalLayout={activeProfile.physicalLayout}
            staticCheatSheet={false}
            activeButtons={activeButtons}
            theme={activeProfile.theme}
            scale={1.2}
            onButtonClick={(btnId) => setSelectedButtonId(btnId)}
            selectedButtonForRemap={selectedButtonId}
          />
        </div>

        {/* Remapping Modal / Overlay Prompt */}
        {selectedButtonId && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
            <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-3 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <h4 className="text-base font-bold text-white mb-1">
              Đang chờ tín hiệu từ tay cầm...
            </h4>
            <p className="text-xs text-slate-300 max-w-md mb-4 leading-relaxed">
              Bạn đang gán lại cho nút{' '}
              <span className="font-bold text-blue-400 uppercase font-mono">
                {selectedButtonId}
              </span>
              .<br />
              Hãy <strong>bấm một nút</strong> hoặc <strong>gạt cần analog</strong> trên tay cầm vật lý của bạn ngay bây giờ.
            </p>

            <button
              type="button"
              onClick={() => setSelectedButtonId(null)}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700"
            >
              Hủy bỏ (Esc)
            </button>
          </div>
        )}
      </div>

      {/* Current Mapping Table */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          Bảng ánh xạ nút hiện tại (Active Bindings)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
          {Object.entries(activeProfile.customMapping).map(([k, target]) => {
            const isCurrentlyActive = activeButtons.has(k);
            return (
              <div
                key={k}
                className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
                  isCurrentlyActive
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}
              >
                <span className="font-mono">{k}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400">
                  {target.type === 'button'
                    ? `Button ${target.index}`
                    : `Axis ${target.index} (${target.direction})`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
