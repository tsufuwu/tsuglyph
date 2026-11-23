import { useState, useEffect, useRef } from 'react';
import { CustomMapping, ButtonMappingTarget, GamepadState } from '../../shared/types';

export interface GamepadInfo {
  connected: boolean;
  id: string;
  buttonCount: number;
  axesCount: number;
}

export interface UseGamepadOptions {
  mapping: CustomMapping;
  isRemapping?: boolean;
  onRemapDetected?: (target: ButtonMappingTarget) => void;
}

export function useGamepad({ mapping, isRemapping, onRemapDetected }: UseGamepadOptions) {
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [gamepadInfo, setGamepadInfo] = useState<GamepadInfo>({
    connected: false,
    id: '',
    buttonCount: 0,
    axesCount: 0,
  });

  const onRemapDetectedRef = useRef(onRemapDetected);
  onRemapDetectedRef.current = onRemapDetected;

  const isRemappingRef = useRef(isRemapping);
  isRemappingRef.current = isRemapping;

  const mappingRef = useRef(mapping);
  mappingRef.current = mapping;

  const prevRawState = useRef<{ buttons: boolean[]; axes: number[] }>({
    buttons: [],
    axes: [],
  });

  const gamepadInfoRef = useRef(gamepadInfo);
  gamepadInfoRef.current = gamepadInfo;

  useEffect(() => {
    const handleState = (state: GamepadState) => {
      if (!state.connected) {
        if (gamepadInfoRef.current.connected) {
          setGamepadInfo({ connected: false, id: '', buttonCount: 0, axesCount: 0 });
          setActiveButtons(new Set());
        }
        return;
      }

      if (!gamepadInfoRef.current.connected || gamepadInfoRef.current.id !== state.id) {
        setGamepadInfo({
          connected: true,
          id: state.id,
          buttonCount: state.buttons.length,
          axesCount: state.axes.length,
        });
      }

      // Remap edge detection
      if (isRemappingRef.current && onRemapDetectedRef.current) {
        for (let i = 0; i < state.buttons.length; i++) {
          const isPressed = state.buttons[i] || (state.buttonValues[i] ?? 0) > 0.4;
          const wasPressed = prevRawState.current.buttons[i];
          if (isPressed && !wasPressed) {
            onRemapDetectedRef.current({ type: 'button', index: i });
            break;
          }
        }
        for (let i = 0; i < state.axes.length; i++) {
          const val = state.axes[i];
          const prevVal = prevRawState.current.axes[i] || 0;
          if (val > 0.55 && prevVal <= 0.5) {
            onRemapDetectedRef.current({ type: 'axis', index: i, direction: 'positive' });
            break;
          } else if (val < -0.55 && prevVal >= -0.5) {
            onRemapDetectedRef.current({ type: 'axis', index: i, direction: 'negative' });
            break;
          }
        }
      }

      prevRawState.current = {
        buttons: state.buttons.map((b, i) => b || (state.buttonValues[i] ?? 0) > 0.3),
        axes: [...state.axes],
      };

      // Map active virtual buttons
      const currentMapping = mappingRef.current;
      const nextActive = new Set<string>();

      for (const [virtualBtnId, target] of Object.entries(currentMapping)) {
        if (target.type === 'button') {
          const isPressed = state.buttons[target.index] || (state.buttonValues[target.index] ?? 0) > 0.2;
          if (isPressed) {
            nextActive.add(virtualBtnId);
          }
        } else if (target.type === 'axis') {
          const axisVal = state.axes[target.index] ?? 0;
          if (target.direction === 'positive' && axisVal > 0.45) {
            nextActive.add(virtualBtnId);
          } else if (target.direction === 'negative' && axisVal < -0.45) {
            nextActive.add(virtualBtnId);
          }
        }
      }

      setActiveButtons((prev) => {
        if (prev.size !== nextActive.size) return nextActive;
        for (const k of nextActive) {
          if (!prev.has(k)) return nextActive;
        }
        return prev;
      });
    };

    // 1. Primary path: Native Windows XInput via IPC
    if (window.electronAPI?.onGamepadState) {
      const unsub = window.electronAPI.onGamepadState(handleState);
      return unsub;
    }

    // 2. Fallback path: Web Gamepad API (Browser/Dev fallback)
    let isRunning = true;
    const pollBrowser = () => {
      if (!isRunning) return;
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      let pad: Gamepad | null = null;
      for (let i = 0; i < pads.length; i++) {
        if (pads[i]?.connected) {
          pad = pads[i];
          break;
        }
      }

      if (!pad) {
        handleState({ connected: false, id: '', buttons: [], buttonValues: [], axes: [] });
        return;
      }

      handleState({
        connected: true,
        id: pad.id,
        buttons: pad.buttons.map((b) => b.pressed),
        buttonValues: pad.buttons.map((b) => b.value),
        axes: [...pad.axes],
      });
    };

    const intervalId = setInterval(pollBrowser, 16);
    pollBrowser();

    return () => {
      isRunning = false;
      clearInterval(intervalId);
    };
  }, []);

  return {
    activeButtons,
    gamepadInfo,
  };
}
