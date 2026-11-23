# UniPad Overlay 🎮

**UniPad Overlay** là ứng dụng Desktop Overlay chuyên dụng trên Windows dành cho game thủ, được phát triển bằng **Electron + React + TailwindCSS**. Ứng dụng giải quyết triệt để vấn đề "loạn nút" khi người dùng sử dụng tay cầm vật lý (như layout Xbox) nhưng chơi các tựa game/phần mềm giả lập tay cầm (ví dụ: ApexSenseBridge giả lập thành DualSense) hoặc chơi trên các trình giả lập console kinh điển (Dolphin GameCube, PCSX2, DuckStation, Project64, Snes9x, Flycast, v.v.).

---

## 🌟 Tính Năng Nổi Bật

### 1. Độc lập hoàn toàn giữa Thiết bị vật lý & Giao diện hiển thị
- Bất kể bạn cắm tay cầm nào (Xbox, PlayStation, Switch Pro, DirectInput), bạn chỉ cần chọn layout hệ máy đang chơi, màn hình sẽ hiển thị chính xác ký hiệu đặc trưng của hệ máy đó.
- **Hỗ trợ 11 Hệ máy:**
  - **Nhóm Hiện đại:** PlayStation DualSense / PS4 (✕, ○, □, △), Xbox Series / 360 (A, B, X, Y), Nintendo Switch Pro (B/A, Y/X).
  - **Nhóm Giả lập Nintendo:** GameCube (Dolphin - Nút A tròn to xanh lá, B đỏ, X/Y hạt đậu, Z tím), Nintendo 64 (A xanh, B lục, cụm 4 nút C vàng), SNES / SFC (4 màu sắc kinh điển), GBA / NDS.
  - **Nhóm Giả lập PlayStation & Sega:** PS1 / PS2 / PS3 DualShock Classic (4 màu nguyên bản), PSP / PS Vita, Sega Dreamcast, Sega Genesis / Saturn (bố cục 2 hàng 6 nút mặt X/Y/Z và A/B/C).

### 2. Kiến trúc Cửa sổ Kép & System Tray
- **Overlay Window:** Không viền (`frame: false`), nền trong suốt hoàn toàn, luôn nổi trên cùng (`alwaysOnTop: 'screen-saver'`) đè mượt mà lên mọi game ở chế độ Borderless Fullscreen hoặc Windowed.
- **Lock Mode (Click-through):** `setIgnoreMouseEvents(true, { forward: true })` cho phép mọi thao tác chuột xuyên qua overlay 100% xuống game.
- **Edit Mode:** Tắt khóa bằng `Ctrl + Shift + L` để tự do dùng chuột kéo thả overlay đến vị trí bất kỳ trên màn hình.
- **Settings Window:** Cửa sổ cài đặt giao diện tối hiện đại, đồng bộ thời gian thực (Real-time IPC) với Overlay mà không cần bấm lưu hay khởi động lại.
- **System Tray:** Thu nhỏ dưới khay hệ thống, menu chuột phải chuyển nhanh Profile, bật/tắt Khóa, ẩn/hiện và mở Cài đặt.

### 3. Nhận diện Gamepad & Custom Remap thông minh
- Đọc tín hiệu thời gian thực từ Web Gamepad API (`requestAnimationFrame`), hỗ trợ cả **nút bấm (buttons)** và **trục cần analog (axes)**.
- Tự động cấu hình thông minh: ví dụ layout N64 tự động gán 4 hướng cần analog phải cho 4 nút C-Buttons vàng; GameCube gán đúng phím A/B/X/Y/Z.
- **Bộ Wizard Remap tương tác:** Bấm vào bất kỳ nút nào trên sơ đồ trong tab *Custom Remap*, sau đó bấm phím hoặc gạt cần analog trên tay cầm thật để gán lại tức thì.
- **Static Cheat-Sheet Mode:** Tùy chọn tắt hiệu ứng nhấp nháy khi bấm để biến overlay thành một bảng tra cứu tĩnh tinh gọn.
- **Chế độ 2 Nhãn (Dual-Label Mode):** Hiển thị thêm ký hiệu nhỏ của tay cầm thật (ví dụ: chữ `Y` nhỏ Xbox ở góc nút `△` DualSense hoặc `C-Up` N64) để rèn phản xạ cơ bắp nhanh chóng.

### 4. Quản lý Profile (Presets) & Tùy biến sâu
- Tạo, sao chép, đổi tên và lưu không giới hạn Profile (ví dụ: *DualSense PC Game*, *Dolphin Zelda GameCube*, *Mario 64 N64*).
- **Scale:** Phóng to/thu nhỏ từ 50% đến 250% bằng đồ họa vector SVG sắc nét không vỡ hạt.
- **Opacity:** Thanh trượt độ mờ 10% đến 100%.
- **Vị trí (Position):** Kéo thả trực tiếp + Nhập tọa độ pixel + Nút đặt nhanh vào 4 góc màn hình.
- **Themes & Colors:** Chọn nhanh 4 Preset màu (*Original Console Colors*, *Minimal White*, *Dark Matte*, *Neon Cyber*) hoặc tự phối màu bằng Color Picker.

---

## ⌨️ Phím Tắt Toàn Cục (Global Shortcuts)

| Tổ hợp phím | Chức năng |
| :--- | :--- |
| `Ctrl + Shift + L` | Bật / Tắt chế độ Khóa (Click-through / Edit Drag Mode) |
| `Ctrl + Shift + H` | Ẩn / Hiện nhanh Overlay |
| `Ctrl + Shift + S` | Mở cửa sổ Cài đặt & Tùy biến (Settings) |
| `Ctrl + Shift + ]` | Chuyển sang Profile tiếp theo |
| `Ctrl + Shift + [` | Chuyển về Profile trước đó |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### 1. Yêu cầu hệ thống
- Hệ điều hành: Windows 10 / Windows 11
- Node.js: Phiên bản 18+ (khuyến nghị Node 20 hoặc 22+)
- Trình quản lý gói: `npm`

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Chạy chế độ Phát triển (Development)
```bash
npm run dev
```

### 4. Biên dịch & Chạy bản Production nội bộ
```bash
npm start
```

### 5. Đóng gói ra file cài đặt Windows (.exe)
```bash
npm run package
```
*File cài đặt NSIS (`.exe`) và bản Portable sẽ được xuất tại thư mục `release/`.*

---

## 📂 Cấu Trúc Thư Mục
```
d:\Controller Button Overlay\
├── package.json
├── tsconfig.json
├── tsconfig.main.json
├── vite.config.ts
├── tailwind.config.cjs
├── postcss.config.cjs
├── resources/
│   ├── icon.svg
│   ├── icon.png
│   └── icon.ico
├── src/
│   ├── main/
│   │   ├── index.ts        # Electron Main, quản lý 2 cửa sổ, IPC Router
│   │   ├── config.ts       # Quản lý đọc/ghi config.json
│   │   ├── shortcuts.ts    # Đăng ký phím tắt toàn cục
│   │   ├── tray.ts         # Khay hệ thống System Tray
│   │   └── preload.ts      # Context Bridge bảo mật
│   ├── shared/
│   │   ├── types.ts        # Kiểu dữ liệu TypeScript dùng chung
│   │   ├── defaultConfigs.ts # Cấu hình mặc định cho 11 hệ máy
│   │   └── defaultMappings.ts# Bảng ánh xạ mặc định
│   └── renderer/
│       ├── main.tsx        # React Root Switcher (#overlay / #settings)
│       ├── hooks/
│       │   ├── useGamepad.ts # Web Gamepad poller (rAF) & Remap listener
│       │   └── useConfig.ts  # Hook đồng bộ IPC thời gian thực
│       ├── layouts/        # Bộ thư viện 11 Layout SVG Modular
│       ├── overlay/        # Giao diện Overlay Window (Click-through & Edit)
│       └── settings/       # Giao diện Settings Window (5 Tabs điều khiển)
```

---

## 🎮 Khuyến Nghị Cấu Hình Cho Trình Giả Lập
1. **Chế độ màn hình:** Hãy cài đặt game hoặc trình giả lập ở chế độ **Borderless Fullscreen** hoặc **Windowed** để UniPad Overlay luôn nằm trên cùng mượt mà nhất.
2. **GameCube (Dolphin):** Nếu dùng tay cầm Xbox, nút A xanh to map với Xbox A, B đỏ nhỏ map với Xbox X, X/Y hạt đậu map với B/Y, Z tím map với RB hoặc RT.
3. **Nintendo 64:** 4 nút C-Buttons màu vàng được gán sẵn cho cần analog phải (Right Stick).
4. **ApexSenseBridge / DS4Windows:** Bật **Chế độ 2 Nhãn (Dual-Label)** để luyện phản xạ giữa biểu tượng PlayStation và nút Xbox vật lý.
