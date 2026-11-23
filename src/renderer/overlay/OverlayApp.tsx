import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useGamepad } from '../hooks/useGamepad';
import { ConsoleLayoutView } from '../layouts/ConsoleLayoutView';
import { Lock, Move, Settings, Gamepad2, AlertTriangle } from 'lucide-react';
import { getLayoutButtons } from '../layouts/layoutDefinitions';

export const OverlayApp: React.FC = () => {
  const { config, activeProfile, setPosition, setLock } = useConfig();
  const { activeButtons, gamepadInfo } = useGamepad({
    mapping: activeProfile ? activeProfile.customMapping : {},
  });

  const [isDragging, setIsDragging] = useState(false);
  const [showLockWarning, setShowLockWarning] = useState(true);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  // Auto-dismiss lock warning after 8 seconds once locked
  useEffect(() => {
    if (config.isLocked) {
      setShowLockWarning(false);
    } else {
      setShowLockWarning(true);
    }
  }, [config.isLocked]);

  // Handle Dragging in Edit Mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (config.isLocked) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: activeProfile.position.x,
      startY: activeProfile.position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      const newX = Math.max(0, Math.min(window.innerWidth - 100, dragStartRef.current.startX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, dragStartRef.current.startY + dy));
      setPosition({ x: Math.round(newX), y: Math.round(newY) });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setPosition]);

  if (!config.isVisible || !activeProfile) {
    return null;
  }

  const { x, y } = activeProfile.position;
  const isLocked = config.isLocked;

  // Compute physical (Xbox) layout panel height for stacking
  const physicalLayoutData = activeProfile.showPhysicalLayoutBelow
    ? getLayoutButtons('xbox', activeProfile.displayMode === 'compact', activeProfile.showShoulders, 'xbox')
    : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none pointer-events-none">
      {/* Positioned Container */}
      <div
        className={`absolute transition-opacity duration-150 ${
          isLocked ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          opacity: activeProfile.opacity,
        }}
      >
        {/* Edit Mode Toolbar & Drag Handle */}
        {!isLocked && (
          <div
            onMouseDown={handleMouseDown}
            className={`flex items-center justify-between gap-2 px-3 py-1.5 mb-2 rounded-lg backdrop-blur-md shadow-2xl border text-xs font-medium cursor-grab active:cursor-grabbing transition-all ${
              isDragging
                ? 'bg-blue-600/90 text-white border-blue-400 shadow-blue-500/30'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5 pointer-events-none">
              <Move className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold">{activeProfile.name}</span>
              <span className="text-slate-400">({x}, {y})</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLock(true);
                }}
                title="Khóa vị trí & bật Click-through (Ctrl+Shift+L)"
                className="p-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.electronAPI) window.electronAPI.openSettings();
                }}
                title="Mở Cài đặt (Ctrl+Shift+S)"
                className="p-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Lock Mode Warning Banner — shown when NOT locked */}
        {!isLocked && showLockWarning && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/50 text-amber-300 text-xs font-semibold backdrop-blur-sm shadow-md pointer-events-auto">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-amber-500/40 font-mono text-amber-200">Ctrl + Shift + L</kbd> để khóa overlay — chuột sẽ xuyên qua vào game
            </span>
            <button
              type="button"
              onClick={() => setShowLockWarning(false)}
              className="ml-auto text-amber-500 hover:text-amber-200 font-bold leading-none"
              title="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        )}

        {/* Primary Console Layout SVG */}
        <div
          className={`relative ${
            !isLocked
              ? 'p-2 rounded-xl border border-dashed border-blue-500/40 bg-slate-950/40 backdrop-blur-sm'
              : ''
          }`}
        >
          <ConsoleLayoutView
            layoutId={activeProfile.layout}
            isCompact={activeProfile.displayMode === 'compact'}
            showShoulders={activeProfile.showShoulders}
            dualLabelEnabled={activeProfile.dualLabelEnabled}
            physicalLayout={activeProfile.physicalLayout}
            staticCheatSheet={activeProfile.staticCheatSheet}
            activeButtons={activeButtons}
            theme={activeProfile.theme}
            scale={activeProfile.scale}
          />

          {/* Gamepad connection status in Edit Mode */}
          {!isLocked && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <div className="flex items-center gap-1.5">
                <Gamepad2
                  className={`w-3.5 h-3.5 ${
                    gamepadInfo.connected ? 'text-emerald-400' : 'text-amber-500'
                  }`}
                />
                <span>
                  {gamepadInfo.connected
                    ? gamepadInfo.id.slice(0, 28)
                    : 'Chưa cắm tay cầm (Đang chờ...)'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* PHYSICAL LAYOUT PANEL — shown below only when showPhysicalLayoutBelow is enabled */}
        {activeProfile.showPhysicalLayoutBelow && physicalLayoutData && (
          <div className={`mt-3 relative ${
            !isLocked
              ? 'p-2 rounded-xl border border-dashed border-purple-500/40 bg-slate-950/40 backdrop-blur-sm'
              : ''
          }`}>
            {/* Separator label */}
            <div className="text-[9px] font-bold uppercase tracking-widest text-purple-400/70 mb-1 px-1 flex items-center gap-1">
              <span className="w-4 h-px bg-purple-500/30" />
              Tay cầm vật lý (Xbox / XInput)
              <span className="flex-1 h-px bg-purple-500/30" />
            </div>
            <ConsoleLayoutView
              layoutId="xbox"
              isCompact={activeProfile.displayMode === 'compact'}
              showShoulders={activeProfile.showShoulders}
              dualLabelEnabled={false}
              physicalLayout="xbox"
              staticCheatSheet={true}
              activeButtons={activeButtons}
              theme={{ id: 'dark_matte' }}
              scale={activeProfile.scale * 0.75}
            />
          </div>
        )}
      </div>
    </div>
  );
};
