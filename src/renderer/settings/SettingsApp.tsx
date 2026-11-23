import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { LayoutTab } from './LayoutTab';
import { TransformTab } from './TransformTab';
import { ThemeTab } from './ThemeTab';
import { RemapTab } from './RemapTab';
import { ShortcutsTab } from './ShortcutsTab';
import {
  Gamepad2,
  Move,
  Palette,
  Crosshair,
  Keyboard,
  CheckCircle,
} from 'lucide-react';

type TabId = 'layout' | 'transform' | 'theme' | 'remap' | 'shortcuts';

export const SettingsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('layout');

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'layout', label: 'Hệ máy & Hiển thị', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'transform', label: 'Vị trí & Kích thước', icon: <Move className="w-4 h-4" /> },
    { id: 'theme', label: 'Màu sắc & Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'remap', label: 'Custom Remap', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'shortcuts', label: 'Phím tắt & Trợ giúp', icon: <Keyboard className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0f1117] text-slate-100 overflow-hidden font-sans">
      {/* Top Profile & Global Bar */}
      <ProfileHeader />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-56 shrink-0 border-r border-slate-800/80 bg-slate-900/30 p-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
              Menu Cấu hình
            </div>
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Footer Status */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Real-time IPC Sync</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Mọi thay đổi lưu tự động vào config.json
            </div>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'layout' && <LayoutTab />}
          {activeTab === 'transform' && <TransformTab />}
          {activeTab === 'theme' && <ThemeTab />}
          {activeTab === 'remap' && <RemapTab />}
          {activeTab === 'shortcuts' && <ShortcutsTab />}
        </div>
      </div>
    </div>
  );
};
