# Kế hoạch Tổ chức lại Files

## Phân tích các file

### 1. **index.html** 
- **Vị trí hiện tại**: `frontend/index.html`
- **Nên giữ ở**: Root của `frontend/` ✅
- **Lý do**: Entry point HTML, Vite yêu cầu file này ở root

### 2. **main.jsx**
- **Vị trí hiện tại**: `frontend/src/main.jsx`
- **Nên giữ ở**: Root của `src/` ✅
- **Lý do**: Entry point React, convention giữ ở root

### 3. **App.jsx** và **App.css**
- **Vị trí hiện tại**: `frontend/src/App.jsx`, `frontend/src/App.css`
- **Đề xuất**: Di chuyển vào `src/app/` hoặc `src/components/app/`
- **Lý do**: App là root component, nên có folder riêng

### 4. **store.js**
- **Vị trí hiện tại**: `frontend/src/store.js`
- **Đề xuất**: Di chuyển vào `src/store/` folder
- **Lý do**: Tổ chức Redux store tốt hơn, dễ mở rộng (reducers, actions)

### 5. **index.css**
- **Vị trí hiện tại**: `frontend/src/index.css`
- **Đề xuất**: Di chuyển vào `src/styles/` hoặc merge với `styles/global.css`
- **Lý do**: Đã có folder styles, nên tập trung CSS ở đó

## Cấu trúc đề xuất

```
frontend/
├── index.html                    # ✅ Giữ nguyên
└── src/
    ├── main.jsx                 # ✅ Giữ nguyên
    ├── app/                     # ✨ MỚI
    │   ├── App.jsx
    │   └── App.css
    ├── store/                   # ✨ MỚI
    │   ├── index.js            # (store.js đổi tên)
    │   └── reducers.js         # (tách riêng reducers nếu cần)
    ├── styles/
    │   ├── index.css           # Import tất cả
    │   ├── global.css          # Merge với index.css
    │   ├── variables.css
    │   ├── layout.css
    │   ├── components.css
    │   ├── pos.css
    │   └── realtime.css
    └── ... (các folder khác)
```

## Lợi ích

1. **App.jsx** trong `app/` folder: Rõ ràng đây là root component
2. **store/** folder: Dễ mở rộng khi thêm reducers, actions, middleware
3. **styles/** tập trung: Tất cả CSS ở một nơi, dễ quản lý
4. **main.jsx** ở root: Tuân theo convention của React/Vite

