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

  // Stores latest state from native XInput
  const nativeStateRef = useRef<GamepadState | null>(null);

  useEffect(() => {
    // 1. Listen for native XInput pushes from Main process
    let unsubNative: (() => void) | undefined;
    if (window.electronAPI?.onGamepadState) {
      unsubNative = window.electronAPI.onGamepadState((state) => {
        nativeStateRef.current = state.connected ? state : null;
      });
    }

    const processState = (state: GamepadState) => {
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

    // 2. Poll browser Gamepad API continuously (works with DualSense, Switch, DirectInput, etc.)
    // If native XInput has a controller connected, use native XInput state.
    // Otherwise, seamlessly use browser Gamepad API.
    let isRunning = true;
    const poll = () => {
      if (!isRunning) return;

      if (nativeStateRef.current && nativeStateRef.current.connected) {
        processState(nativeStateRef.current);
        return;
      }

      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      let activePad: Gamepad | null = null;
      for (let i = 0; i < pads.length; i++) {
        if (pads[i]?.connected) {
          activePad = pads[i];
          break;
        }
      }

      if (activePad) {
        processState({
          connected: true,
          id: activePad.id,
          buttons: activePad.buttons.map((b) => b.pressed),
          buttonValues: activePad.buttons.map((b) => b.value),
          axes: [...activePad.axes],
        });
      } else {
        processState({ connected: false, id: '', buttons: [], buttonValues: [], axes: [] });
      }
    };

    const intervalId = setInterval(poll, 16);
    poll();

    return () => {
      isRunning = false;
      clearInterval(intervalId);
      if (unsubNative) unsubNative();
    };
  }, []);

  return {
    activeButtons,
    gamepadInfo,
  };
}
