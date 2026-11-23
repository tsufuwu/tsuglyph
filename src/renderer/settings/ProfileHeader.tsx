import React, { useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { Profile } from '../../shared/types';
import { getDefaultMappingForLayout } from '../../shared/defaultMappings';
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

export const ProfileHeader: React.FC = () => {
  const { config, activeProfile, saveConfig, toggleLock } = useConfig();
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState('');

  if (!activeProfile) return null;

  const handleSelectProfile = (id: string) => {
    saveConfig({ ...config, activeProfileId: id });
  };

  const handleCreateProfile = () => {
    const newId = `profile-${Date.now()}`;
    const newProfile: Profile = {
      ...activeProfile,
      id: newId,
      name: `${activeProfile.name} (Bản sao)`,
      customMapping: { ...activeProfile.customMapping },
    };
    saveConfig({
      ...config,
      activeProfileId: newId,
      profiles: [...config.profiles, newProfile],
    });
  };

  const handleDuplicateProfile = () => {
    handleCreateProfile();
  };

  const handleDeleteProfile = () => {
    if (config.profiles.length <= 1) {
      alert('Phải giữ lại ít nhất 1 Profile!');
      return;
    }
    const remaining = config.profiles.filter((p) => p.id !== activeProfile.id);
    saveConfig({
      ...config,
      activeProfileId: remaining[0].id,
      profiles: remaining,
    });
  };

  const startRename = () => {
    setNameInput(activeProfile.name);
    setIsRenaming(true);
  };

  const saveRename = () => {
    if (!nameInput.trim()) return;
    const updated = config.profiles.map((p) =>
      p.id === activeProfile.id ? { ...p, name: nameInput.trim() } : p
    );
    saveConfig({ ...config, profiles: updated });
    setIsRenaming(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
      {/* Profile Selector & Naming */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Layers className="w-5 h-5" />
        </div>

        {isRenaming ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveRename()}
              autoFocus
              className="px-3 py-1 text-sm bg-slate-800 border border-blue-500 rounded text-white focus:outline-none"
            />
            <button
              onClick={saveRename}
              className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <select
              value={activeProfile.id}
              onChange={(e) => handleSelectProfile(e.target.value)}
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {config.profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={startRename}
              title="Đổi tên Profile"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Profile Action Buttons */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
          <button
            onClick={handleDuplicateProfile}
            title="Nhân bản Profile này"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCreateProfile}
            title="Tạo Profile mới"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-xs font-medium text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Profile</span>
          </button>
          {config.profiles.length > 1 && (
            <button
              onClick={handleDeleteProfile}
              title="Xóa Profile hiện tại"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-600/80 text-slate-400 hover:text-white transition-colors border border-slate-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Global Mode Indicators */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLock}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            config.isLocked
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          {config.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>{config.isLocked ? 'Khóa (Click-through)' : 'Kéo thả (Edit Mode)'}</span>
        </button>

        <button
          onClick={() => saveConfig({ ...config, isVisible: !config.isVisible })}
          className={`p-1.5 rounded-lg border text-xs transition-colors ${
            config.isVisible
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              : 'bg-red-950/40 border-red-800 text-red-400 hover:text-red-300'
          }`}
          title={config.isVisible ? 'Đang hiển thị Overlay (Ctrl+Shift+H)' : 'Đang ẩn Overlay (Ctrl+Shift+H)'}
        >
          {config.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
