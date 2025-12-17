import { API_CONFIG } from '../constants/config';

export const apiService = {
  async getProducts(page = 1, pageSize = 10) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}?page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getOrders() {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ORDERS_ENDPOINT}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getOrderById(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ORDERS_ENDPOINT}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order detail');
    return response.json();
  },

  async createOrder(items) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ORDERS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create order');
    }
    return response.json();
  },
};
