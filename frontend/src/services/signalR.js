import * as signalR from '@microsoft/signalr';
import { SIGNALR_CONFIG } from '../constants/config';

let connection = null;
let isConnecting = false;
let connectionPromise = null;

export const signalRService = {
  async connect(onOrderCreated) {
    // Nếu đã kết nối, chỉ cần thêm callback
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      if (onOrderCreated) {
        connection.on('OrderCreated', onOrderCreated);
      }
      return connection;
    }

    // Nếu đang kết nối, đợi connection hiện tại
    if (isConnecting && connectionPromise) {
      try {
        await connectionPromise;
        if (onOrderCreated) {
          connection.on('OrderCreated', onOrderCreated);
        }
        return connection;
      } catch (err) {
        // Nếu connection thất bại, tạo mới
      }
    }

    // Nếu đã có connection nhưng đang disconnected, dừng nó trước
    if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
      try {
        await connection.stop();
      } catch (err) {
        // Ignore stop errors
      }
    }

    // Tạo connection mới
    isConnecting = true;
    connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_CONFIG.HUB_URL)
      .withAutomaticReconnect()
      .build();

    // Thêm callback nếu có
    if (onOrderCreated) {
      connection.on('OrderCreated', onOrderCreated);
    }

    // Start connection
    connectionPromise = connection.start()
      .then(() => {
        console.log('SignalR Connected');
        isConnecting = false;
        return connection;
      })
      .catch((err) => {
        isConnecting = false;
        // Chỉ log lỗi nếu không phải là lỗi negotiation (thường tự reconnect)
        if (!err.message.includes('negotiation') && !err.message.includes('stopped')) {
          console.error('SignalR Connection Error:', err);
        }
        throw err;
      });

    return connectionPromise;
  },

  async disconnect() {
    isConnecting = false;
    connectionPromise = null;
    if (connection) {
      try {
        await connection.stop();
      } catch (err) {
        // Ignore stop errors
      }
      connection = null;
    }
  },
};
