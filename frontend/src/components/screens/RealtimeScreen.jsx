import { useState, useEffect } from 'react';
import { useTranslate } from 'react-redux-multilingual';
import { apiService } from '../../services/api';
import { getTranslatedProductName } from '../../utils/productTranslations';
import { signalRService } from '../../services/signalR';

export default function RealtimeScreen() {
  const translate = useTranslate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadOrders();

    // Setup SignalR connection
    let isMounted = true;
    const setupConnection = async () => {
      try {
        await signalRService.connect((newOrder) => {
          if (isMounted) {
            // Add new order to the top of the list
            setOrders(prevOrders => [newOrder, ...prevOrders]);
          }
        });
      } catch (error) {
        console.error('Failed to setup SignalR connection:', error);
      }
    };

    setupConnection();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      // Không disconnect để giữ connection cho các component khác
      // signalRService.disconnect();
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = async (orderId) => {
    try {
      setDetailLoading(true);
      setSelectedOrder(null);
      const detail = await apiService.getOrderById(orderId);
      setSelectedOrder(detail);
    } catch (error) {
      console.error('Error loading order detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">{translate('pos.loading')}</div>;
  }

  return (
    <div className="realtime-screen">
      <h1>{translate('realtime.title')}</h1>
      <p className="status">{translate('realtime.status')}</p>

      {orders.length === 0 ? (
        <p className="empty-orders">{translate('realtime.noOrders')}</p>
      ) : (
        <div className="realtime-layout">
          <div className="orders-list">
            {orders.map(order => (
              <div
                key={order.id}
                className={
                  selectedOrder && selectedOrder.id === order.id
                    ? 'order-card order-card-selected'
                    : 'order-card'
                }
                onClick={() => handleSelectOrder(order.id)}
              >
                <div className="order-header">
                  <span className="order-id">{translate('realtime.orderId')}: #{order.id}</span>
                  <span className="order-total">
                    {translate('realtime.total')}: {order.total.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="order-time">
                  {translate('realtime.paymentTime')}: {formatDate(order.paidAtUtc)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-detail-panel">
            {detailLoading && (
              <div className="order-detail-loading">{translate('realtime.loadingDetail')}</div>
            )}
            {!detailLoading && !selectedOrder && (
              <div className="order-detail-empty">{translate('realtime.selectOrder')}</div>
            )}
            {!detailLoading && selectedOrder && (
              <div className="order-detail">
                <h2>{translate('realtime.orderDetail')} #{selectedOrder.id}</h2>
                <p className="order-detail-time">
                  {translate('realtime.paymentTime')}: {formatDate(selectedOrder.paidAtUtc)}
                </p>
                <table className="order-detail-table">
                  <thead>
                    <tr>
                      <th>{translate('realtime.product')}</th>
                      <th>{translate('realtime.qty')}</th>
                      <th>{translate('realtime.unitPrice')}</th>
                      <th>{translate('realtime.lineTotal')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{getTranslatedProductName(translate, null, item.productName)}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unitPrice.toLocaleString('vi-VN')} ₫</td>
                        <td>{item.lineTotal.toLocaleString('vi-VN')} ₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-detail-total">
                  {translate('realtime.total')}: {selectedOrder.total.toLocaleString('vi-VN')} ₫
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
