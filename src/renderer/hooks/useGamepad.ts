import { useState, useEffect, useRef, useCallback } from 'react';
import { CustomMapping, ButtonMappingTarget } from '../../shared/types';

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

  const animFrameRef = useRef<number | null>(null);
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

  useEffect(() => {
    let isRunning = true;

    const poll = () => {
      if (!isRunning) return;

      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      let activePad: Gamepad | null = null;

      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && gamepads[i]!.connected) {
          activePad = gamepads[i];
          break;
        }
      }

      if (!activePad) {
        if (gamepadInfo.connected) {
          setGamepadInfo({
            connected: false,
            id: '',
            buttonCount: 0,
            axesCount: 0,
          });
          setActiveButtons(new Set());
        }
        return;
      }

      // Update info if status changed
      if (!gamepadInfo.connected || gamepadInfo.id !== activePad.id) {
        setGamepadInfo({
          connected: true,
          id: activePad.id,
          buttonCount: activePad.buttons.length,
          axesCount: activePad.axes.length,
        });
      }

      // Check for Remap Detection if listening
      if (isRemappingRef.current && onRemapDetectedRef.current) {
        // 1. Check buttons
        for (let i = 0; i < activePad.buttons.length; i++) {
          const btn = activePad.buttons[i];
          const isPressed = btn.pressed || btn.value > 0.4;
          const wasPressed = prevRawState.current.buttons[i];

          // Trigger on newly pressed button (rising edge)
          if (isPressed && !wasPressed) {
            onRemapDetectedRef.current({ type: 'button', index: i });
            break;
          }
        }

        // 2. Check axes
        for (let i = 0; i < activePad.axes.length; i++) {
          const val = activePad.axes[i];
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

      // Save raw state for edge detection
      prevRawState.current = {
        buttons: activePad.buttons.map((b) => b.pressed || b.value > 0.3),
        axes: [...activePad.axes],
      };

      // Resolve mapped active buttons
      const currentMapping = mappingRef.current;
      const nextActive = new Set<string>();

      for (const [virtualBtnId, target] of Object.entries(currentMapping)) {
        if (target.type === 'button') {
          const btn = activePad.buttons[target.index];
          if (btn && (btn.pressed || btn.value > 0.2)) {
            nextActive.add(virtualBtnId);
          }
        } else if (target.type === 'axis') {
          const axisVal = activePad.axes[target.index] ?? 0;
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

    // Use a high-frequency interval timer (~60fps) so polling never stops when game is focused
    const intervalId = setInterval(poll, 16);
    poll();

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
