import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useGamepad } from '../hooks/useGamepad';
import { ConsoleLayoutView } from '../layouts/ConsoleLayoutView';
import { Move, Settings, Gamepad2, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLayoutButtons } from '../layouts/layoutDefinitions';

type Corner = 'nw' | 'ne' | 'sw' | 'se';

export const OverlayApp: React.FC = () => {
  const { config, activeProfile, setPosition, updateActiveProfile, saveConfig } = useConfig();
  const { activeButtons, gamepadInfo } = useGamepad({
    mapping: activeProfile ? activeProfile.customMapping : {},
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dragStartRef = useRef<{ screenX: number; screenY: number; windowX: number; windowY: number }>({
    screenX: 0,
    screenY: 0,
    windowX: 0,
    windowY: 0,
  });
  const hasMovedRef = useRef<boolean>(false);

  const resizeStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    startScale: number;
    corner: Corner;
  }>({
    mouseX: 0,
    mouseY: 0,
    startScale: 1,
    corner: 'se',
  });

  // Next / Previous Layout Navigation
  const handlePrevProfile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const profiles = config.profiles;
    if (!profiles || profiles.length === 0) return;
    const currentIndex = profiles.findIndex((p) => p.id === config.activeProfileId);
    const prevIndex = (currentIndex - 1 + profiles.length) % profiles.length;
    const targetProfile = profiles[prevIndex];
    const currentPos = activeProfile?.position;
    const currentScale = activeProfile?.scale;
    const updatedProfiles = profiles.map((p, idx) =>
      idx === prevIndex
        ? {
            ...p,
            ...(currentPos ? { position: currentPos } : {}),
            ...(currentScale ? { scale: currentScale } : {}),
          }
        : p
    );
    saveConfig({ ...config, profiles: updatedProfiles, activeProfileId: targetProfile.id });
  }, [config, activeProfile?.position, activeProfile?.scale, saveConfig]);

  const handleNextProfile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const profiles = config.profiles;
    if (!profiles || profiles.length === 0) return;
    const currentIndex = profiles.findIndex((p) => p.id === config.activeProfileId);
    const nextIndex = (currentIndex + 1) % profiles.length;
    const targetProfile = profiles[nextIndex];
    const currentPos = activeProfile?.position;
    const currentScale = activeProfile?.scale;
    const updatedProfiles = profiles.map((p, idx) =>
      idx === nextIndex
        ? {
            ...p,
            ...(currentPos ? { position: currentPos } : {}),
            ...(currentScale ? { scale: currentScale } : {}),
          }
        : p
    );
    saveConfig({ ...config, profiles: updatedProfiles, activeProfileId: targetProfile.id });
  }, [config, activeProfile?.position, activeProfile?.scale, saveConfig]);

  // Enable mouse interaction when hovered (with 200ms debounce to prevent losing hover on edge)
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
    if (window.electronAPI?.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging || isResizing) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;
      const isHover = containerRef.current.matches(':hover');
      if (!isHover && !isDragging && !isResizing) {
        setIsHovered(false);
        if (window.electronAPI?.setIgnoreMouseEvents) {
          window.electronAPI.setIgnoreMouseEvents(true, true);
        }
      }
    }, 200);
  }, [isDragging, isResizing]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // left click only
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      screenX: e.screenX,
      screenY: e.screenY,
      windowX: activeProfile?.position?.x ?? 0,
      windowY: activeProfile?.position?.y ?? 0,
    };
  };

  // Handle Resize Corner MouseDown
  const handleResizeMouseDown = (e: React.MouseEvent, corner: Corner) => {
    e.stopPropagation(); // prevent window drag
    if (e.button !== 0) return;
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startScale: activeProfile?.scale ?? 1,
      corner,
    };
  };

  useEffect(() => {
    let latestPos = { x: activeProfile?.position?.x ?? 0, y: activeProfile?.position?.y ?? 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // 1. Handle Dragging Position (Direct instantaneous move without disk-write lag)
      if (isDragging) {
        const dx = e.screenX - dragStartRef.current.screenX;
        const dy = e.screenY - dragStartRef.current.screenY;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          hasMovedRef.current = true;
        }

        const newX = Math.round(dragStartRef.current.windowX + dx);
        const newY = Math.round(dragStartRef.current.windowY + dy);
        latestPos = { x: newX, y: newY };

        if (window.electronAPI?.setOverlayPosition) {
          window.electronAPI.setOverlayPosition(latestPos);
        }
      }

      // 2. Handle Resizing Scale
      if (isResizing) {
        const { mouseX, mouseY, startScale, corner } = resizeStartRef.current;
        let delta = 0;

        switch (corner) {
          case 'se': // bottom-right: right/down increases
            delta = (e.clientX - mouseX + (e.clientY - mouseY)) / 2;
            break;
          case 'sw': // bottom-left: left/down increases
            delta = (-(e.clientX - mouseX) + (e.clientY - mouseY)) / 2;
            break;
          case 'ne': // top-right: right/up increases
            delta = (e.clientX - mouseX - (e.clientY - mouseY)) / 2;
            break;
          case 'nw': // top-left: left/up increases
            delta = (-(e.clientX - mouseX) - (e.clientY - mouseY)) / 2;
            break;
        }

        // 180px movement = 1.0 scale change
        const scaleDelta = delta / 180;
        const newScale = Math.min(2.5, Math.max(0.5, Math.round((startScale + scaleDelta) * 100) / 100));
        updateActiveProfile({ scale: newScale });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        setIsDragging(false);
        if (hasMovedRef.current) {
          // Finished dragging: persist final position to profile config once
          const dx = e.screenX - dragStartRef.current.screenX;
          const dy = e.screenY - dragStartRef.current.screenY;
          const finalX = Math.round(dragStartRef.current.windowX + dx);
          const finalY = Math.round(dragStartRef.current.windowY + dy);
          setPosition({ x: finalX, y: finalY });
        } else {
          // If clicked without dragging on the layout, open Settings window
          if (window.electronAPI) {
            window.electronAPI.openSettings();
          }
        }
      }

      if (isResizing) {
        setIsResizing(false);
      }

      // Check if mouse left container
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

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, setPosition, updateActiveProfile, activeProfile?.position]);

  if (!config.isVisible || !activeProfile) {
    return null;
  }

  const isInteractive = isHovered || isDragging || isResizing;
  const { x, y } = activeProfile.position;

  // Compute physical (Xbox) layout panel data if enabled
  const physicalLayoutData = activeProfile.showPhysicalLayoutBelow
    ? getLayoutButtons('xbox', activeProfile.displayMode === 'compact', activeProfile.showShoulders, 'xbox')
    : null;

  return (
    <div className="w-full h-full overflow-hidden select-none bg-transparent p-3 flex items-start justify-start">
      {/* Positioned Container */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        className={`pointer-events-auto cursor-grab active:cursor-grabbing rounded-2xl relative inline-flex flex-col items-center ${
          isInteractive
            ? 'ring-2 ring-blue-500/70 bg-slate-950/75 backdrop-blur-sm p-2 shadow-2xl min-w-[315px]'
            : 'p-2'
        }`}
        style={{
          opacity: activeProfile.opacity,
        }}
        title="Kéo để di chuyển • Kéo 4 góc đổi kích cỡ • Click mở Cài đặt"
      >
        {/* 4 Corner Resize Handles */}
        {isInteractive && (
          <>
            <ResizeHandle corner="nw" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle corner="ne" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle corner="sw" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle corner="se" onMouseDown={handleResizeMouseDown} />
          </>
        )}

        {/* Mini Toolbar: Inside container so mouse NEVER leaves container when hovering toolbar */}
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className={`w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-2 rounded-lg bg-slate-900/95 border border-slate-700/80 text-xs font-medium text-slate-200 shadow-md whitespace-nowrap z-40 transition-opacity duration-150 ${
            isInteractive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Left: Move icon + Layout Prev / Next Switcher */}
          <div className="flex items-center gap-1">
            <Move className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 cursor-grab" title="Kéo để di chuyển" />

            {/* Prev Layout Button */}
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handlePrevProfile}
              title="Chuyển sang layout trước (Previous layout)"
              className="p-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Current Layout Name */}
            <span
              className="font-semibold text-[11px] text-white max-w-[130px] truncate select-none px-0.5"
              title={activeProfile.name}
            >
              {activeProfile.name}
            </span>

            {/* Next Layout Button */}
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleNextProfile}
              title="Chuyển sang layout tiếp theo (Next layout)"
              className="p-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Scale % + Settings + Quit */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-[10px] text-blue-400 font-mono bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/50">
              <Maximize2 className="w-2.5 h-2.5" />
              <span>{Math.round(activeProfile.scale * 100)}%</span>
            </div>

            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (window.electronAPI) window.electronAPI.openSettings();
              }}
              title="Mở Cài đặt"
              className="p-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (window.electronAPI?.quitApp) {
                  window.electronAPI.quitApp();
                }
              }}
              title="Thoát hoàn toàn ứng dụng TsuGlyph"
              className="p-1 rounded bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary Console Layout SVG */}
        <div className="relative flex justify-center">
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
          {isInteractive && (
            <div className="absolute -bottom-5 left-1 flex items-center gap-1 text-[10px] text-slate-400">
              <Gamepad2
                className={`w-3 h-3 ${
                  gamepadInfo.connected ? 'text-emerald-400' : 'text-amber-500'
                }`}
              />
              <span className="truncate max-w-[180px]">
                {gamepadInfo.connected
                  ? gamepadInfo.id.slice(0, 22)
                  : 'Chờ tay cầm...'}
              </span>
            </div>
          )}
        </div>

        {/* PHYSICAL LAYOUT PANEL — shown below only when showPhysicalLayoutBelow is enabled */}
        {activeProfile.showPhysicalLayoutBelow && physicalLayoutData && (
          <div className="mt-4 relative p-2 rounded-xl border border-dashed border-purple-500/30 bg-slate-950/30 backdrop-blur-sm flex flex-col items-center">
            {/* Separator label */}
            <div className="w-full text-[9px] font-bold uppercase tracking-widest text-purple-400/70 mb-1 px-1 flex items-center gap-1">
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

// 4 Corner Resize Handle Component
const ResizeHandle: React.FC<{
  corner: Corner;
  onMouseDown: (e: React.MouseEvent, corner: Corner) => void;
}> = ({ corner, onMouseDown }) => {
  const positionClasses = {
    nw: '-top-2 -left-2 cursor-nwse-resize',
    ne: '-top-2 -right-2 cursor-nesw-resize',
    sw: '-bottom-2 -left-2 cursor-nesw-resize',
    se: '-bottom-2 -right-2 cursor-nwse-resize',
  }[corner];

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, corner)}
      title="Kéo góc này để phóng to / thu nhỏ kích thước"
      className={`absolute ${positionClasses} w-5 h-5 rounded-md bg-blue-600 hover:bg-blue-400 border-2 border-white shadow-xl hover:scale-125 active:scale-95 transition-transform flex items-center justify-center pointer-events-auto z-30 group`}
    >
      <svg
        className="w-2.5 h-2.5 text-white stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {corner === 'nw' || corner === 'se' ? (
          <>
            <line x1="6" y1="6" x2="18" y2="18" />
            <polyline points="6 12 6 6 12 6" />
            <polyline points="18 12 18 18 12 18" />
          </>
        ) : (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <polyline points="12 6 18 6 18 12" />
            <polyline points="6 12 6 18 12 18" />
          </>
        )}
      </svg>
    </div>
  );
};
