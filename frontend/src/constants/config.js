// API Configuration
// Use environment variable in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:5000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  PRODUCTS_ENDPOINT: '/products',
  ORDERS_ENDPOINT: '/orders',
};

// SignalR Configuration
export const SIGNALR_CONFIG = {
  HUB_URL: `${API_HOST}/hubs/orders`,
  RECONNECT_DELAY: 1000,
  MAX_RECONNECT_TIME: 60000,
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
};

// VAT Configuration
export const VAT_CONFIG = {
  RATE: 0.08, // 8%
};

// Snackbar Configuration
export const SNACKBAR_CONFIG = {
  AUTO_CLOSE_DELAY: 3000, // 3 seconds
  ANIMATION_DELAY: 300, // 300ms for animation
};

// App Configuration
export const APP_CONFIG = {
  DEFAULT_LOCALE: 'vi',
  SUPPORTED_LOCALES: ['vi', 'en'],
};

