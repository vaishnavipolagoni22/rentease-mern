# RentEase - House Rental Management System (MERN Stack)

A full-stack MERN web application for managing rental properties with role-based access for Renters, Owners, and Admins.

---

## Project Structure

```
rentease/
├── backend/          # Node.js + Express + MongoDB API
└── frontend/         # React.js frontend
```

---

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm

---

## Setup & Installation

### 1. Backend Setup

```bash
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Create uploads folder for images
mkdir uploads

# Start the server
npm run dev   # development (nodemon)
# or
npm start     # production
```

Backend runs at: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## Default Admin Account

To create an admin, register a user then manually update their role in MongoDB:

```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Features

### Public (Landing Page)
- Browse all properties with search and filters
- Filter by address, ad type (rent/sale), property type (residential/commercial)

### Owner Dashboard
- Add new properties with images
- View and manage all their listings (edit/delete)
- Manage booking requests (mark as booked or pending)

### Renter Dashboard
- Browse and search all available properties
- Book properties with contact details
- View booking history and status

### Admin Dashboard
- View all users
- Grant/Ungrant owner access
- View all properties across the platform
- View all bookings

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login

### Properties
- `GET /api/properties` — Get all properties (with filters)
- `GET /api/properties/my` — Get owner's properties (auth)
- `POST /api/properties` — Add property (owner)
- `PUT /api/properties/:id` — Update property (owner)
- `DELETE /api/properties/:id` — Delete property (owner)

### Bookings
- `POST /api/bookings` — Create booking (renter)
- `GET /api/bookings/my` — Get renter's bookings
- `GET /api/bookings/owner` — Get owner's bookings
- `PUT /api/bookings/:id/status` — Update booking status (owner)

### Admin
- `GET /api/admin/users` — Get all users
- `PUT /api/admin/users/:id/grant` — Toggle owner grant
- `GET /api/admin/properties` — Get all properties
- `GET /api/admin/bookings` — Get all bookings

---

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **File Upload**: Multer
