import React from 'react';
import { Keyboard, HelpCircle, Gamepad2, Layers, Cpu } from 'lucide-react';

export const ShortcutsTab: React.FC = () => {
  const shortcuts = [
    {
      keys: ['Ctrl', 'Shift', 'L'],
      action: 'Bật / Tắt Chế độ Khóa (Click-through / Edit Mode)',
      desc: 'Khi Khóa, mọi click chuột đi xuyên qua overlay xuống game. Khi Mở, bạn có thể kéo thả tự do.',
    },
    {
      keys: ['Ctrl', 'Shift', 'H'],
      action: 'Ẩn / Hiện nhanh Overlay',
      desc: 'Tạm ẩn overlay khi xem cắt cảnh hoặc không cần tra cứu nút.',
    },
    {
      keys: ['Ctrl', 'Shift', 'S'],
      action: 'Mở cửa sổ Cài đặt & Tùy biến (Settings)',
      desc: 'Mở bảng điều khiển này mọi lúc ngay cả khi đang trong game.',
    },
    {
      keys: ['Ctrl', 'Shift', ']'],
      action: 'Chuyển sang Profile tiếp theo',
      desc: 'Đổi layout tay cầm nhanh tức thì không cần mở cài đặt.',
    },
    {
      keys: ['Ctrl', 'Shift', '['],
      action: 'Chuyển về Profile trước đó',
      desc: 'Đổi ngược lại profile trước đó.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Phím tắt Toàn cục (Global Shortcuts)</h3>
        <p className="text-xs text-slate-400">
          Các tổ hợp phím hoạt động toàn hệ thống ngay cả khi bạn đang chơi game toàn màn hình không viền
        </p>
      </div>

      {/* Shortcuts List */}
      <div className="space-y-2.5">
        {shortcuts.map((s, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          >
            <div>
              <div className="text-xs font-semibold text-slate-200">{s.action}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {s.keys.map((k) => (
                <kbd
                  key={k}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] font-bold shadow-sm"
                >
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Setup Guide for Emulators */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-semibold text-slate-200">
            Mẹo cấu hình tốt nhất cho Trình giả lập & PC Game
          </h4>
        </div>

        <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
          <p>
            • <strong>Chế độ hiển thị game:</strong> Hãy đặt game hoặc trình giả lập ở chế độ{' '}
            <span className="text-slate-200 font-medium">Borderless Fullscreen</span> hoặc{' '}
            <span className="text-slate-200 font-medium">Windowed</span> để TsuGlyph luôn hiển thị trên cùng mượt mà nhất.
          </p>
          <p>
            • <strong>Giả lập Dolphin (GameCube):</strong> Nút A to màu xanh lá cây mặc định map với nút A (Xbox), nút B đỏ nhỏ map với nút X (Xbox), nút X & Y hình hạt đậu map với nút B & Y.
          </p>
          <p>
            • <strong>Nintendo 64:</strong> Bốn nút C-Buttons màu vàng được ánh xạ tự động vào 4 hướng của cần Analog phải (Right Stick).
          </p>
          <p>
            • <strong>ApexSenseBridge / DS4Windows:</strong> Nếu bạn dùng phần mềm chuyển đổi tay cầm vật lý thành DualSense ảo, hãy chọn layout <strong>PlayStation DualSense</strong> và bật <strong>Chế độ 2 Nhãn (Dual-Label)</strong> để quen mắt ngay lập tức.
          </p>
        </div>
      </div>
    </div>
  );
};
