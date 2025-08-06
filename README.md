# Task Manager Application

A full-stack task management application built with React, Node.js, Express, and PostgreSQL.

## Features

### User Features
- ✅ User registration and authentication
- ✅ Create, edit, and delete tasks
- ✅ Mark tasks as completed/pending
- ✅ Filter tasks by status (All/Pending/Completed)
- ✅ Set due dates for tasks
- ✅ Drag & drop task reordering
- ✅ Dark/Light/System theme support
- ✅ Responsive design with Tailwind CSS
- ✅ Email reminders for due tasks

### Admin Features
- ✅ Admin panel (accessible only to DarkWinzo@gmail.com)
- ✅ View all users and their tasks
- ✅ Delete users and tasks
- ✅ System statistics

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- React Beautiful DnD (drag & drop)
- Axios (HTTP client)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs (password hashing)
- Nodemailer (email reminders)
- node-cron (scheduled tasks)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### 1. Clone and Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Create a PostgreSQL database named `taskmanager`
2. Copy `.env.example` to `.env` and update the database credentials:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=taskmanager
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Email Configuration (Optional)
For email reminders, add your Gmail credentials to `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Run the Application
```bash
npm run dev
```

This will start both the frontend (port 3000) and backend (port 5000) servers.

## Admin Access

The admin panel is accessible only to the user with email `DarkWinzo@gmail.com` and password `Isuru@123`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Admin (requires admin authentication)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/tasks` - Get all tasks
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/tasks/:id` - Delete task

## Features Implemented

### Security
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Admin-only access control

### UI/UX
- ✅ Modern, responsive design
- ✅ Dark/Light/System theme toggle
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling
- ✅ Drag & drop functionality

### Bonus Features
- ✅ Email reminders for due tasks (daily at 9 AM)
- ✅ Drag & drop task reordering
- ✅ Admin panel with user management
- ✅ Task due date tracking with overdue indicators

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `created_at` (TIMESTAMP)

### Tasks Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (VARCHAR: 'pending' | 'completed')
- `due_date` (DATE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## License

MIT License