import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslate } from 'react-redux-multilingual';
import { apiService } from '../../services/api';
import { getTranslatedProductName, getTranslatedCategory } from '../../utils/productTranslations';
import Snackbar from '../common/Snackbar';
import { VAT_CONFIG } from '../../constants';

export default function POSScreen() {
  const translate = useTranslate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentNote, setPaymentNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const observerRef = useRef(null);
  const loadMoreProducts = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadProducts(currentPage + 1);
    }
  }, [loadingMore, hasMore, currentPage]);

  const lastProductElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreProducts();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, loadMoreProducts]);

  useEffect(() => {
    loadProducts(1);
  }, []);

  const loadProducts = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const data = await apiService.getProducts(page, 10);
      if (page === 1) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }
      setHasMore(data.pagination.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading products:', error);
      setSnackbar({ type: 'error', text: translate('pos.loadProductsError'), show: true });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };


  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getSubTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getVAT = () => {
    return getSubTotal() * VAT_CONFIG.RATE;
  };

  const getTotal = () => {
    return getSubTotal() + getVAT();
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setSnackbar({ type: 'error', text: translate('pos.emptyCartError'), show: true });
      return;
    }

    try {
      setProcessing(true);
      setSnackbar(null);

      const orderItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      await apiService.createOrder(orderItems);
      
      setSnackbar({ type: 'success', text: translate('pos.paymentSuccess'), show: true });
      setCart([]);
      setPaymentNote('');
    } catch (error) {
      console.error('Error creating order:', error);
      setSnackbar({ type: 'error', text: error.message || translate('pos.paymentFailed'), show: true });
    } finally {
      setProcessing(false);
    }
  };

  // Get current date - memoized to avoid unnecessary recalculations
  const currentDate = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN');
  }, []);

  // Categories & filter
  const allCategoryKey = 'all';
  const categories = useMemo(
    () => {
      const productCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
      // Always include all categories that exist in the system
      const allCategories = ['Nước pha chế', 'Nước đóng chai', 'Bánh ngọt'];
      // Combine and deduplicate
      const uniqueCategories = Array.from(new Set([...allCategories, ...productCategories]));
      return uniqueCategories;
    },
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      activeCategory === allCategoryKey
        ? products
        : products.filter(
            p => (p.category || allCategoryKey) === activeCategory
          ),
    [products, activeCategory]
  );

  if (loading) {
    return <div className="loading">{translate('pos.loading')}</div>;
  }

  return (
    <div className="pos-screen-new">
      <Snackbar 
        message={snackbar} 
        onClose={() => setSnackbar(null)} 
      />

      <div className="pos-layout">
        {/* Left Panel - Products */}
        <div className="products-panel">
          <div className="products-header">
            <h2>{translate('pos.products')}</h2>
            <div className="category-filters">
              <button
                type="button"
                className={
                  activeCategory === allCategoryKey
                    ? 'category-filter-btn active'
                    : 'category-filter-btn'
                }
                onClick={() => setActiveCategory(allCategoryKey)}
              >
                {translate('pos.all')}
              </button>
              {categories.filter(cat => cat !== allCategoryKey).map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    activeCategory === category
                      ? 'category-filter-btn active'
                      : 'category-filter-btn'
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {getTranslatedCategory(translate, category)}
                </button>
              ))}
            </div>
          </div>
          <div className="products-grid-new">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-item"
                onClick={() => addToCart(product)}
              >
                <div className="product-image">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-img"
                    />
                  ) : (
                    <div className="product-placeholder">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-name">
                    {getTranslatedProductName(translate, product.id, product.name)}
                  </div>
                  <div className="product-price">
                    {product.price.toLocaleString('vi-VN')} VND
                  </div>
                  {product.category && (
                    <div className="product-category-badge">
                      {getTranslatedCategory(translate, product.category)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loadingMore && (
              <div className="loading-more">{translate('pos.loadingMore')}</div>
            )}
            {hasMore && !loadingMore && (
              <div ref={lastProductElementRef} style={{ height: '20px' }}></div>
            )}
          </div>
        </div>

        {/* Right Panel - Order & Checkout */}
        <div className="order-panel">
          {/* Order Information */}
          <div className="order-info-section">
            <div className="form-group">
              <label htmlFor="order-date">{translate('pos.date')} (*)</label>
              <input 
                id="order-date"
                name="orderDate"
                type="text" 
                value={currentDate} 
                readOnly
                className="form-control"
                aria-label={translate('pos.date')}
              />
            </div>
          </div>

          {/* Cart Table */}
          <div className="cart-table-section">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>{translate('pos.image')}</th>
                  <th>{translate('pos.service')}</th>
                  <th>{translate('pos.quantity')}</th>
                  <th>{translate('pos.price')}</th>
                  <th>{translate('pos.total')}</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cart-text">{translate('pos.emptyCart')}</td>
                  </tr>
                ) : (
                  cart.map(item => (
                    <tr key={item.productId}>
                      <td className="cart-image-cell">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="cart-item-image" />
                        ) : (
                          <div className="cart-item-placeholder">
                            {item.productName.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="service-name">
                        {getTranslatedProductName(translate, item.productId, item.productName)}
                      </td>
                      <td>
                        <div className="quantity-controls">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.productId, -1);
                            }}
                            className="btn-qty"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.productId, 1);
                            }}
                            className="btn-qty"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="price-cell">{item.price.toLocaleString('vi-VN')}</td>
                      <td className="total-cell">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item.productId);
                          }}
                          className="btn-remove-item"
                          title={translate('pos.remove')}
                          aria-label={translate('pos.remove')}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Payment Tabs */}
          <div className="payment-tabs">
            <button type="button" className="tab-active">{translate('pos.payment')}</button>
          </div>

          {/* Payment Section */}
          <div className="payment-section">
            <div className="payment-form">
              <div className="bill-summary">
                <div className="summary-row">
                  <span>{translate('pos.subtotal')}:</span>
                  <span>{getSubTotal().toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="summary-row">
                  <span>{translate('pos.vat')}:</span>
                  <span>{getVAT().toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="summary-row total-row">
                  <span><strong>{translate('pos.totalAmount')}:</strong></span>
                  <span><strong>{getTotal().toLocaleString('vi-VN')} ₫</strong></span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">{translate('pos.paymentMethod')} (*)</label>
                <select 
                  id="paymentMethod"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-control"
                >
                  <option value="Cash">{translate('pos.cash')}</option>
                  <option value="Card">{translate('pos.card')}</option>
                  <option value="Transfer">{translate('pos.transfer')}</option>
                  <option value="Other">{translate('pos.other')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">{translate('pos.amount')} (*)</label>
                <div className="amount-input-group">
                  <input 
                    id="amount"
                    name="amount"
                    type="text" 
                    value={getTotal().toLocaleString('vi-VN')} 
                    readOnly
                    className="form-control amount-input"
                  />
                  <select id="currency" name="currency" className="currency-select" disabled>
                    <option>VND</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="note">{translate('pos.note')}</label>
                <textarea 
                  id="note"
                  name="note"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="form-control note-textarea"
                  placeholder={translate('pos.notePlaceholder')}
                  rows="3"
                />
              </div>

              <button 
                type="button"
                onClick={handleCheckout} 
                className="btn-payment"
                disabled={processing || cart.length === 0}
                aria-label={translate('pos.checkout')}
              >
                {processing ? translate('pos.processing') : translate('pos.checkout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}