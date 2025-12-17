# POS System (React + ASP.NET Core)

## Công nghệ

### Backend (API + Realtime)

- ASP.NET Core 9 Web API
- SignalR (orders realtime)
- In-memory storage (có thể thay bằng DB sau)

### Frontend (POS + Realtime)

- React (Function Components)
- @microsoft/signalr client
- Vite

## Chạy nhanh bằng Docker

Yêu cầu: Docker & Docker Compose

```bash
git clone <repo-url>
cd pos-system
docker-compose up --build
```

Sau khi chạy:

- Frontend: http://localhost:3000
- Backend API + Swagger: http://localhost:5000
- SignalR Hub: ws/http://localhost:5000/hubs/orders

## Cấu trúc thư mục (rút gọn)

```
pos-system/
├─ backend/Pos.Api/       # ASP.NET Core API + SignalR
│  ├─ Controllers/        # Products, Orders
│  ├─ Repositories/       # InMemory product/order
│  ├─ Hubs/OrdersHub.cs   # Realtime orders
│  └─ Dockerfile
├─ frontend/              # React + Vite
│  ├─ src/components/     # POSScreen, RealtimeScreen, Snackbar
│  ├─ src/services/       # api.js, signalR.js
│  └─ Dockerfile
└─ docker-compose.yml
```

## Chạy thủ công (dev)

Backend:

```bash
cd backend/Pos.Api
dotnet restore
dotnet run  http://localhost:5000
```

Frontend:

```bash
cd frontend
npm install
npm run dev http://localhost:5173
```

## Endpoints chính

- GET /api/products
- GET /api/orders
- POST /api/orders
- SignalR Hub: /hubs/orders (event: OrderCreated)
