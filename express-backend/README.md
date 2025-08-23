# Express Backend for Guest Room Booking System

## Features
- User/Admin authentication (multiple admins supported)
- Guest room and room management
- Booking management
- Real-time vacancy check
- RESTful API (see docs/api.md for endpoints)
- SQLite for local database


## Setup
1. Run `npm install`
2. Copy `.env.example` to `.env` and set your secrets
3. Run `npm start` or `npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user/admin
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout (client-side only)

### Categories
- `GET /api/categories` — List categories
- `POST /api/categories` — Create (admin)
- `PUT /api/categories/:id` — Update (admin)
- `DELETE /api/categories/:id` — Delete (admin)

### Rooms
- `GET /api/rooms` — List rooms
- `POST /api/rooms` — Create (admin)
- `PUT /api/rooms/:id` — Update (admin)
- `DELETE /api/rooms/:id` — Delete (admin)

### Bookings
- `GET /api/bookings` — List bookings
- `POST /api/bookings` — Create booking
- `PUT /api/bookings/:id/status` — Update status (admin)
- `DELETE /api/bookings/:id` — Delete (admin)
- `GET /api/bookings/vacancy` — Check vacancy (query params: categoryId, dateFrom, dateTo, numRooms)

All endpoints (except register/login) require Bearer JWT authentication.
