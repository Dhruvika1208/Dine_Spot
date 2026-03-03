# DineSpot — Smart Restaurant Reservation & Management System

A production-ready MERN stack application for restaurant reservations and management.

## Features

- **User Role**: Browse restaurants, search by location/cuisine, book tables, receive QR code & email, manage past/upcoming reservations.
- **Staff Role**: Manage restaurant menu, tables, and reservations. Scan QR codes for check-in. View analytics dashboard.
- **Smart Logic**: Automatic table allocation, reservation duration (2h), no-show auto-cancel (1h), auto-completion.
- **Tech Stack**: React (Vite), TailwindCSS, Node.js, Express, MongoDB, JWT, node-cron, Nodemailer, Recharts.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` based on `.env.example`.
4. Run `npm run seed` to populate initial data.
5. Run `npm start` or `npm run dev`.

### Frontend
1. `cd frontend`
2. `npm install`
3. Run `npm run dev`.

## Staff Credentials (from seed)
- Email: `staff@thegoldenspoon.com`
- Password: `password123`

## User Credentials (from seed)
- Email: `john@example.com`
- Password: `password123`
