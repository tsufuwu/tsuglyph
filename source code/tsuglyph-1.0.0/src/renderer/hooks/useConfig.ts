import { useState, useEffect, useCallback } from 'react';
import { AppConfig, Profile, Position } from '../../shared/types';
import { DEFAULT_APP_CONFIG } from '../../shared/defaultConfigs';

export function useConfig() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeConfig: (() => void) | undefined;
    let unsubscribeLock: (() => void) | undefined;
    let unsubscribeProfile: (() => void) | undefined;

    const init = async () => {
      if (window.electronAPI) {
        try {
          const loaded = await window.electronAPI.getConfig();
          setConfig(loaded);
        } catch (e) {
          console.error('[useConfig] Failed to fetch initial config:', e);
        }

        unsubscribeConfig = window.electronAPI.onConfigChanged((newConfig) => {
          setConfig(newConfig);
        });

        unsubscribeLock = window.electronAPI.onLockChanged((locked) => {
          setConfig((prev) => ({ ...prev, isLocked: locked }));
        });

        unsubscribeProfile = window.electronAPI.onProfileCycle((direction) => {
          // Handled primarily by main process dispatching config change
        });
      }
      setLoading(false);
    };

    init();

    return () => {
      if (unsubscribeConfig) unsubscribeConfig();
      if (unsubscribeLock) unsubscribeLock();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const saveConfig = useCallback(async (newConfig: AppConfig) => {
    setConfig(newConfig);
    if (window.electronAPI) {
      await window.electronAPI.saveConfig(newConfig);
    }
  }, []);

  const activeProfile = config.profiles.find((p) => p.id === config.activeProfileId) || config.profiles[0];

  const updateActiveProfile = useCallback((updater: Partial<Profile> | ((prev: Profile) => Profile)) => {
    setConfig((prevConfig) => {
      const updatedProfiles = prevConfig.profiles.map((p) => {
        if (p.id === prevConfig.activeProfileId) {
          return typeof updater === 'function' ? updater(p) : { ...p, ...updater };
        }
        return p;
      });
      const nextConfig = { ...prevConfig, profiles: updatedProfiles };
      if (window.electronAPI) {
        window.electronAPI.saveConfig(nextConfig);
      }
      return nextConfig;
    });
  }, []);

  const setPosition = useCallback((pos: Position) => {
    updateActiveProfile({ position: pos });
    if (window.electronAPI) {
      window.electronAPI.setOverlayPosition(pos);
    }
  }, [updateActiveProfile]);

  const toggleLock = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.toggleLock();
    } else {
      setConfig((prev) => ({ ...prev, isLocked: !prev.isLocked }));
    }
  }, []);

  const setLock = useCallback(async (locked: boolean) => {
    if (window.electronAPI) {
      await window.electronAPI.setLock(locked);
    } else {
      setConfig((prev) => ({ ...prev, isLocked: locked }));
    }
  }, []);

  return {
    config,
    activeProfile,
    loading,
    saveConfig,
    updateActiveProfile,
    setPosition,
    toggleLock,
    setLock,
  };
}
