# Cấu trúc Frontend - Hoàn chỉnh

## Cấu trúc thư mục cuối cùng

```
frontend/
├── index.html                    # ✅ Entry point HTML (Vite yêu cầu ở root)
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # ✅ Entry point React (giữ ở root)
    │
    ├── app/                      # ✨ Root App Component
    │   ├── App.jsx               # Main app component với routing
    │   └── App.css               # App-specific styles
    │
    ├── store/                    # ✨ Redux Store
    │   └── index.js              # Store configuration (từ store.js)
    │
    ├── components/               # React Components
    │   ├── layout/               # Layout components
    │   │   ├── Header.jsx
    │   │   └── Footer.jsx
    │   ├── screens/              # Screen components
    │   │   ├── POSScreen.jsx
    │   │   └── RealtimeScreen.jsx
    │   ├── common/               # Shared components
    │   │   └── Snackbar.jsx
    │   └── index.js              # Centralized exports
    │
    ├── services/                 # API & SignalR services
    │   ├── api.js
    │   └── signalR.js
    │
    ├── constants/                # Configuration constants
    │   ├── config.js             # API, SignalR, VAT, etc.
    │   ├── routes.js             # Route definitions
    │   └── index.js              # Centralized exports
    │
    ├── utils/                    # Utility functions
    │   └── productTranslations.js
    │
    ├── styles/                   # ✨ Tất cả CSS files
    │   ├── index.css             # Main entry point (imports tất cả)
    │   ├── variables.css         # CSS variables (design tokens)
    │   ├── global.css            # Global styles (merge từ index.css)
    │   ├── layout.css            # Header, Footer styles
    │   ├── components.css        # Common components (Snackbar)
    │   ├── pos.css               # POS Screen styles
    │   └── realtime.css          # Realtime Screen styles
    │
    ├── i18n/                     # Internationalization
    │   └── translations.js
    │
    └── hooks/                    # Custom hooks (future)
```

## Quyết định về từng file

### ✅ Giữ ở root của `src/`
- **main.jsx**: Entry point React, convention giữ ở root

### ✅ Giữ ở root của `frontend/`
- **index.html**: Entry point HTML, Vite yêu cầu ở root

### ✨ Đã di chuyển

1. **App.jsx** → `src/app/App.jsx`
   - Lý do: Root component nên có folder riêng
   - Import path: `'./app/App.jsx'`

2. **App.css** → `src/app/App.css`
   - Lý do: Styles của App component
   - Import trong: `styles/index.css`

3. **store.js** → `src/store/index.js`
   - Lý do: Tổ chức Redux store tốt hơn, dễ mở rộng
   - Import path: `'./store'` (tự động tìm index.js)

4. **index.css** → Merged vào `styles/global.css`
   - Lý do: Tránh trùng lặp, tập trung CSS ở `styles/`
   - Đã merge: Reset styles, root styles vào global.css

## Import paths sau khi refactor

### main.jsx
```javascript
import store from './store';              // ✅ Tự động tìm index.js
import './styles/index.css';              // ✅ Import tất cả styles
import App from './app/App.jsx';          // ✅ App component
```

### App.jsx
```javascript
import POSScreen from '../components/screens/POSScreen';
import Header from '../components/layout/Header';
import './App.css';                       // ✅ Relative path
```

## Lợi ích của cấu trúc mới

1. **Tổ chức rõ ràng**: Mỗi loại file có folder riêng
2. **Dễ bảo trì**: Dễ tìm và sửa code
3. **Scalable**: Dễ mở rộng khi thêm features
4. **Convention**: Tuân theo best practices của React/Vite
5. **Tập trung**: CSS, constants, services ở một nơi

## Migration Checklist

- [x] Tạo folder `app/` và di chuyển App.jsx, App.css
- [x] Tạo folder `store/` và di chuyển store.js → index.js
- [x] Merge index.css vào global.css
- [x] Cập nhật imports trong main.jsx
- [x] Cập nhật imports trong App.jsx
- [x] Cập nhật styles/index.css để import App.css
- [x] Xóa index.css cũ
- [x] Test imports và linter

## Notes

- `index.html` phải ở root của `frontend/` (Vite requirement)
- `main.jsx` nên ở root của `src/` (React convention)
- Tất cả CSS được import qua `styles/index.css`
- Store có thể mở rộng thêm reducers, actions trong tương lai

