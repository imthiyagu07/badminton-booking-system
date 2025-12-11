# 🏸 Badminton Court Booking System

A full-stack web application for booking badminton courts with dynamic pricing, equipment rental, and coach booking features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Design](#database-design)
- [Pricing Engine](#pricing-engine)

## ✨ Features

### Core Features
- **Multi-Resource Booking**: Book court + equipment + coach in a single atomic transaction
- **Dynamic Pricing Engine**: Configurable pricing rules that stack (peak hours, weekends, indoor premium)
- **Real-time Availability**: Check court, equipment, and coach availability before booking
- **Booking Management**: View and cancel bookings via email lookup
- **Admin Panel**: Manage courts, equipment, coaches, and pricing rules

### Bonus Features
- **Atomic Transactions**: All resources must be available or booking fails
- **Price Transparency**: Detailed breakdown showing base price + applied rules
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Form Validation**: Client-side validation with helpful error messages

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **API Style**: RESTful

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS with CSS Variables

## 📁 Project Structure

```
badminton-booking-system/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── Court.js
│   │   │   ├── Equipment.js
│   │   │   ├── Coach.js
│   │   │   ├── PricingRule.js
│   │   │   ├── Booking.js
│   │   │   └── Waitlist.js
│   │   ├── controllers/     # Route handlers
│   │   │   ├── courtController.js
│   │   │   ├── equipmentController.js
│   │   │   ├── coachController.js
│   │   │   ├── pricingRuleController.js
│   │   │   └── bookingController.js
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Business logic
│   │   │   ├── pricingEngine.js
│   │   │   ├── availabilityChecker.js
│   │   │   └── seedData.js
│   │   └── config/
│   │       └── database.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   └── Admin.jsx
│   │   ├── services/        # API calls
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/imthiyagu07/badminton-booking-system.git
cd badminton-booking-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/badminton_booking
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the Database

```bash
cd ../backend
npm run seed
```

This will populate the database with:
- 4 courts (2 indoor, 2 outdoor)
- 5 equipment items (rackets and shoes)
- 3 coaches with availability schedules
- 4 pricing rules

## ▶️ Running the Application

### Start MongoDB

```bash
mongod
```

### Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📡 API Endpoints

### Courts
- `GET /api/courts` - Get all active courts
- `GET /api/courts/:id` - Get court by ID
- `POST /api/courts` - Create new court (Admin)
- `PUT /api/courts/:id` - Update court (Admin)
- `DELETE /api/courts/:id` - Deactivate court (Admin)

### Equipment
- `GET /api/equipment` - Get all active equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment (Admin)
- `PUT /api/equipment/:id` - Update equipment (Admin)
- `DELETE /api/equipment/:id` - Deactivate equipment (Admin)

### Coaches
- `GET /api/coaches` - Get all active coaches
- `GET /api/coaches/:id` - Get coach by ID
- `POST /api/coaches` - Create new coach (Admin)
- `PUT /api/coaches/:id` - Update coach (Admin)
- `DELETE /api/coaches/:id` - Deactivate coach (Admin)

### Pricing Rules
- `GET /api/pricing-rules` - Get all pricing rules
- `GET /api/pricing-rules/:id` - Get rule by ID
- `POST /api/pricing-rules` - Create new rule (Admin)
- `PUT /api/pricing-rules/:id` - Update rule (Admin)
- `DELETE /api/pricing-rules/:id` - Delete rule (Admin)

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (with filters)
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/available-slots?courtId=&date=` - Get booked slots

## 🗄️ Database Design

### Key Entities

1. **Court**: Court information (name, type, base price)
2. **Equipment**: Rental equipment with inventory tracking
3. **Coach**: Coach profiles with availability schedules
4. **PricingRule**: Configurable pricing rules with conditions
5. **Booking**: Multi-resource bookings with pricing breakdown
6. **Waitlist**: Queue for fully booked slots (bonus feature)

### Relationships

- Booking → Court (many-to-one)
- Booking → Equipment (many-to-many with quantity)
- Booking → Coach (many-to-one, optional)
- Booking → PricingRule (referenced in pricing breakdown)

## 💰 Pricing Engine

### How It Works

1. **Base Calculation**:
   - Court: `basePrice × duration`
   - Equipment: `Σ(pricePerUnit × quantity × duration)`
   - Coach: `pricePerHour × duration`

2. **Rule Application**:
   - Fetch all active pricing rules sorted by priority
   - For each rule, check if conditions match:
     - Time range (e.g., 18:00-21:00)
     - Days of week (e.g., Saturday, Sunday)
     - Court types (e.g., indoor)
     - Date range (optional)
   - Apply matching rules in order

3. **Rule Stacking**:
   ```
   Base: ₹500/hour × 2 hours = ₹1000
   Peak Hour (+30%): ₹1000 × 1.30 = ₹1300
   Weekend (+20%): ₹1300 × 1.20 = ₹1560
   Indoor (+₹200): ₹1560 + ₹200 = ₹1760
   Total: ₹1760 + equipment + coach
   ```

### Example Pricing Rules

- **Peak Hour Premium**: +30% between 18:00-21:00
- **Weekend Surcharge**: +20% on Saturday and Sunday
- **Indoor Court Premium**: +₹200 fixed for indoor courts
- **Early Morning Discount**: -10% before 08:00

## 🎯 Key Assumptions

1. **No User Authentication**: Simplified for assignment scope
2. **Email-based Booking Lookup**: Users search bookings via email
3. **Single Currency**: All prices in INR (₹)
4. **Time Format**: 24-hour format (HH:MM)
5. **Minimum Booking**: 30 minutes (0.5 hours)

## 🔮 Future Enhancements

- User authentication and profiles
- Payment gateway integration
- Email notifications
- Waitlist with automatic notifications
- Calendar view for availability
- Booking analytics dashboard
- Mobile app (React Native)

## 👨‍💻 Author

**Thiyagu**
- GitHub: [@imthiyagu07](https://github.com/imthiyagu07)

## 📄 License

This project is created as an assignment for Acorn Globus.

---

**Built with ❤️ using MERN Stack**
