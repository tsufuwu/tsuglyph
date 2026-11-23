import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useGamepad } from '../hooks/useGamepad';
import { ConsoleLayoutView } from '../layouts/ConsoleLayoutView';
import { Move, Settings, Gamepad2 } from 'lucide-react';
import { getLayoutButtons } from '../layouts/layoutDefinitions';

export const OverlayApp: React.FC = () => {
  const { config, activeProfile, setPosition } = useConfig();
  const { activeButtons, gamepadInfo } = useGamepad({
    mapping: activeProfile ? activeProfile.customMapping : {},
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const hasMovedRef = useRef<boolean>(false);

  // Set ignore mouse events on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (window.electronAPI?.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) return;
    setIsHovered(false);
    if (window.electronAPI?.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(true, true);
    }
  }, [isDragging]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: activeProfile?.position.x ?? 0,
      startY: activeProfile?.position.y ?? 0,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }

      const newX = Math.max(0, Math.min(window.innerWidth - 80, dragStartRef.current.startX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, dragStartRef.current.startY + dy));
      setPosition({ x: Math.round(newX), y: Math.round(newY) });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      // If user clicked without dragging, open Settings window
      if (!hasMovedRef.current) {
        if (window.electronAPI) {
          window.electronAPI.openSettings();
        }
      }

      // Check if mouse left the container during drag
      setTimeout(() => {
        if (!containerRef.current) return;
        const isHover = containerRef.current.matches(':hover');
        if (!isHover) {
          setIsHovered(false);
          if (window.electronAPI?.setIgnoreMouseEvents) {
            window.electronAPI.setIgnoreMouseEvents(true, true);
          }
        }
      }, 50);
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

  // Compute physical (Xbox) layout panel data if enabled
  const physicalLayoutData = activeProfile.showPhysicalLayoutBelow
    ? getLayoutButtons('xbox', activeProfile.displayMode === 'compact', activeProfile.showShoulders, 'xbox')
    : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none pointer-events-none">
      {/* Positioned Container */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing transition-opacity duration-150 rounded-2xl ${
          isHovered || isDragging
            ? 'ring-1 ring-blue-500/50 bg-slate-950/40 backdrop-blur-sm p-2 shadow-2xl'
            : 'p-2'
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          opacity: activeProfile.opacity,
        }}
        title="Kéo để di chuyển • Click để mở Cài đặt"
      >
        {/* Hover Mini Toolbar */}
        {(isHovered || isDragging) && (
          <div className="flex items-center justify-between gap-2 px-2.5 py-1 mb-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-200 shadow-md">
            <div className="flex items-center gap-1.5 pointer-events-none">
              <Move className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-[11px] text-white">{activeProfile.name}</span>
              <span className="text-[10px] text-slate-400">({x}, {y})</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">
                Click mở Cài đặt
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.electronAPI) window.electronAPI.openSettings();
                }}
                title="Mở Cài đặt"
                className="p-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Primary Console Layout SVG */}
        <div className="relative">
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

          {/* Gamepad connection status hint when hovered */}
          {(isHovered || isDragging) && (
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <div className="flex items-center gap-1">
                <Gamepad2
                  className={`w-3 h-3 ${
                    gamepadInfo.connected ? 'text-emerald-400' : 'text-amber-500'
                  }`}
                />
                <span className="truncate max-w-[200px]">
                  {gamepadInfo.connected
                    ? gamepadInfo.id.slice(0, 25)
                    : 'Chờ tay cầm...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* PHYSICAL LAYOUT PANEL — shown below only when showPhysicalLayoutBelow is enabled */}
        {activeProfile.showPhysicalLayoutBelow && physicalLayoutData && (
          <div className="mt-3 relative p-2 rounded-xl border border-dashed border-purple-500/30 bg-slate-950/30 backdrop-blur-sm">
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
