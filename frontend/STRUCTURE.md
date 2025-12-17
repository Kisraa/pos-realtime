# Cấu trúc Frontend - Tổ chức lại

## Cấu trúc thư mục mới

```
frontend/src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── screens/          # Screen components
│   │   ├── POSScreen.jsx
│   │   └── RealtimeScreen.jsx
│   └── common/           # Shared components
│       └── Snackbar.jsx
├── services/             # API & SignalR services
│   ├── api.js
│   └── signalR.js
├── constants/            # Configuration constants
│   ├── config.js         # API, SignalR, VAT, etc.
│   └── routes.js         # Route definitions
├── utils/                # Utility functions
│   └── productTranslations.js
├── styles/               # CSS files (tách riêng)
│   ├── index.css         # Main entry point
│   ├── variables.css     # CSS variables
│   ├── global.css        # Global styles
│   ├── layout.css        # Header, Footer styles
│   ├── components.css    # Common components (Snackbar)
│   ├── pos.css           # POS Screen styles
│   └── realtime.css      # Realtime Screen styles
├── i18n/                 # Internationalization
│   └── translations.js
├── hooks/                # Custom hooks (future)
├── store.js              # Redux store
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Base styles
```

## Lợi ích của cấu trúc mới

1. **Tổ chức rõ ràng**: Components được phân loại theo chức năng
2. **Dễ bảo trì**: Mỗi file có trách nhiệm rõ ràng
3. **Tái sử dụng**: Common components dễ tìm và sử dụng
4. **Scalable**: Dễ mở rộng khi thêm features mới
5. **Constants tập trung**: Config ở một nơi, dễ thay đổi
6. **CSS modular**: Tách CSS theo component, dễ quản lý

## Cách sử dụng

### Import Components
```javascript
// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Screen components
import POSScreen from './components/screens/POSScreen';
import RealtimeScreen from './components/screens/RealtimeScreen';

// Common components
import Snackbar from './components/common/Snackbar';
```

### Import Constants
```javascript
import { API_CONFIG, VAT_CONFIG } from './constants/config';
import { ROUTES } from './constants/routes';
```

### Import Styles
```javascript
// Import tất cả styles từ index
import './styles/index.css';
```

## Migration Notes

- Tất cả components đã được di chuyển vào thư mục phù hợp
- Services đã được cập nhật để sử dụng constants
- CSS sẽ được tách thành các file riêng (có thể làm sau)
- App.css hiện tại vẫn hoạt động, có thể refactor dần

