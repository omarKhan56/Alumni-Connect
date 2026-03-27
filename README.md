# AlumniConnect — MERN Stack

A full-stack alumni management platform built with **MongoDB · Express.js · React.js · Node.js**

Prepared by: Omar Ali Khan · Parth Taur · Advait Gawale Patil · Bhumi Deshmukh

---

## Project Structure

```
alumni-connect/
├── backend/                 # Node.js + Express REST API
│   ├── config/              # Cloudinary config
│   ├── controllers/         # Auth controller
│   ├── middleware/          # JWT auth + role middleware
│   ├── models/              # Mongoose models (User, Post, Event, Job, Message, Mentorship, Donation)
│   ├── routes/              # All API routes
│   ├── utils/               # Nodemailer email utility
│   ├── server.js            # Express + Socket.io server entry
│   ├── .env.example         # Environment variable template
│   └── package.json
│
└── frontend/                # React + Vite SPA
    ├── src/
    │   ├── components/
    │   │   └── layout/      # AppLayout (sidebar + topbar)
    │   ├── pages/           # All page components
    │   ├── store/           # Redux Toolkit store + slices
    │   ├── utils/           # Axios API + Socket.io client
    │   └── App.jsx          # Router + protected routes
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Copy and fill in environment variables
cp .env.example .env
# Edit .env with your:
#   - MongoDB Atlas URI
#   - JWT Secret
#   - Cloudinary credentials
#   - Gmail SMTP credentials
#   - Razorpay keys (test mode)

npm run dev       # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev       # Starts on http://localhost:5173
```

---

## Environment Variables (backend/.env)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing (keep long & random) |
| `JWT_EXPIRE` | Token expiry duration e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `EMAIL_HOST` | SMTP host e.g. `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port e.g. `587` |
| `EMAIL_USER` | Gmail address |
| `EMAIL_PASS` | Gmail App Password (not your real password) |
| `RAZORPAY_KEY_ID` | From Razorpay test dashboard |
| `RAZORPAY_KEY_SECRET` | From Razorpay test dashboard |
| `CLIENT_URL` | Frontend URL e.g. `http://localhost:5173` |

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, receive JWT | No |
| GET | `/api/auth/verifyemail/:token` | Verify email | No |
| POST | `/api/auth/forgot-password` | Send reset email | No |
| GET | `/api/users/profile` | Get own profile | Yes |
| PUT | `/api/users/profile` | Update own profile | Yes |
| GET | `/api/users/alumni` | Paginated alumni directory | Yes |
| GET | `/api/posts` | News feed (paginated) | Yes |
| POST | `/api/posts` | Create post | Yes |
| PUT | `/api/posts/:id/like` | Toggle like | Yes |
| POST | `/api/posts/:id/comment` | Add comment | Yes |
| GET | `/api/events` | List events | Yes |
| POST | `/api/events` | Create event | Admin |
| POST | `/api/events/:id/rsvp` | RSVP to event | Yes |
| GET | `/api/jobs` | Browse jobs | Yes |
| POST | `/api/jobs` | Post a job | Alumni/Admin |
| POST | `/api/mentorship/request` | Submit mentorship request | Student |
| PUT | `/api/mentorship/:id/approve` | Approve/reject request | Admin |
| GET | `/api/messages/conversations` | Conversation list | Yes |
| GET | `/api/messages/:userId` | Fetch thread | Yes |
| POST | `/api/donations` | Record donation | Yes |
| GET | `/api/admin/analytics` | Dashboard metrics | Admin |
| GET | `/api/admin/users` | All users list | Admin |
| PUT | `/api/admin/users/:id/role` | Change user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

---

## Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/verify-email/:token` | Email Verification | Public |
| `/forgot-password` | Forgot Password | Public |
| `/reset-password/:token` | Reset Password | Public |
| `/dashboard` | Dashboard | All roles |
| `/feed` | News Feed | All roles |
| `/alumni` | Alumni Directory | All roles |
| `/alumni/:id` | Alumni Profile | All roles |
| `/jobs` | Jobs & Internships | All roles |
| `/events` | Events | All roles |
| `/messages` | Messages | All roles |
| `/messages/:userId` | Direct Chat | All roles |
| `/mentorship` | Mentorship | All roles |
| `/donations` | Donations | All roles |
| `/profile` | Edit Profile | All roles |
| `/admin` | Admin Panel | Admin only |

---

## Tech Stack

### Backend
- **Node.js** + **Express.js** — REST API
- **MongoDB Atlas** + **Mongoose** — Database & ODM
- **Socket.io** — Real-time messaging (WebSocket)
- **JWT (jsonwebtoken)** — Stateless authentication
- **bcryptjs** — Password hashing (salt rounds: 12)
- **Cloudinary** — Image/media storage
- **Nodemailer** — Email (Gmail SMTP)
- **express-validator** — Input validation

### Frontend
- **React 18** + **Vite** — SPA framework
- **Redux Toolkit** — Global state (auth)
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Socket.io-client** — Real-time chat
- **Tailwind CSS** — Styling
- **Recharts** — Analytics charts
- **react-hot-toast** — Notifications
- **date-fns** — Date formatting

---

## Security Features

- JWT tokens signed with HS256, 7-day expiry
- bcrypt password hashing with salt rounds: 12
- Email verification before login access
- Role-based access control (alumni / student / admin)
- Profile visibility toggle (public / private)
- Input sanitization via express-validator
- No binary data stored in DB (Cloudinary URLs only)
