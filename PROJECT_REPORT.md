# LeadMates Project Report

**Date:** 2026-02-12
**Project Name:** LeadMates
**Version:** 1.0.0

## 1. Executive Summary

LeadMates is a comprehensive User & Lead Management System designed to streamline the process of capturing, tracking, and converting leads. Built with a modern tech stack, it features a robust role-based access control (RBAC) system, interactive dashboards, and a suite of tools for managing projects, campaigns, and team members.

## 2. Technology Stack

### Frontend Application
- **Framework:** React 19 (via Vite)
- **Styling:** TailwindCSS 4, Framer Motion (Animations), Lucide React (Icons)
- **State Management:** Context API (Theme, Auth, Search, Notifications)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios (with Interceptors for JWT handling)
- **Charts:** Recharts

### Backend API
- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MySQL (managed via Knex.js query builder)
- **Authentication:** JWT (Access & Refresh Tokens)
- **Security:** Helmet, CORS, BCrypt (Password Hashing)
- **File Handling:** Multer (for Avatar uploads)

## 3. Core Features

### 3.1 Authentication & Security
- **Secure Login/Signup:** JWT-based stateless authentication with automatic token refreshing.
- **RBAC (Role-Based Access Control):** Granular permissions for Admins, Users, and custom roles.
- **Session Management:** Secure logout and session invalidation.
- **Profile Security:** Password encryption and secure avatar uploads.

### 3.2 Dashboard & Analytics
- **Interactive Dashboard:** Real-time overview of leads, projects, and active users.
- **Data Visualization:** Charts displaying lead acquisition trends and campaign performance.
- **Notification System:** Real-time alerts for system events and user actions.

### 3.3 Lead Management
- **Lead Capture:** Forms to capture new leads with custom fields.
- **Lead Tracking:** List view with filtering, searching, and detailed profiles.
- **Status Workflow:** Track leads through different stages (New, Contacted, Qualified, Closed).

### 3.4 Project & Campaign Management
- **Projects:** Organize leads and tasks into specific projects.
- **Campaigns:** Manage marketing campaigns and track their effectiveness.

### 3.5 Administration
- **User Management:** Create, update, and manage system users (Operatives).
- **Role Management:** Define custom roles and assign specific permissions.
- **System Logs:** Activity logging for auditing purposes.
- **Trash/Archive:** Soft-delete functionality for recovering accidental deletions.

## 4. Project Structure

### Frontend (`/src`)
- **`api/`**: Centralized API service modules (auth, leads, projects, etc.).
- **`components/`**: Reusable UI components (Navbar, Footer, Modals).
- **`context/`**: Global state providers (Auth, Theme, Notifications).
- **`dashboard/`**: Protected dashboard layout and pages (LeadsPage, ProjectsPage, etc.).
- **`pages/`**: Public-facing pages (Home, Login, Pricing).

### Backend (`/backend/src`)
- **`controllers/`**: Request handling logic.
- **`models/`**: Database interaction via Knex.
- **`routes/`**: API endpoint definitions.
- **`middleware/`**: Auth checks, permission validation, and error handling.
- **`migrations/`**: Database schema version control.

## 5. Setup & Installation

### Prerequisites
- Node.js (v18+)
- MySQL Server

### Installation Steps
1.  **Clone Repository:**
    ```bash
    git clone <repo-url>
    cd LeadMates
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    cp .env.example .env  # Configure DB credentials
    npm run migrate:latest # Run DB migrations
    npm run dev           # Start server on port 5000
    ```

3.  **Frontend Setup:**
    ```bash
    cd ..
    npm install
    npm run dev           # Start frontend on port 5173
    ```

## 6. API Overview

The backend exposes a RESTful API at `http://localhost:5000/api`. Key endpoints include:

-   `POST /api/auth/login`: Authenticate user.
-   `GET /api/leads`: Fetch all leads (paginated).
-   `POST /api/leads`: Create a new lead.
-   `GET /api/projects`: List active projects.
-   `GET /api/admin/users`: Admin-only user management.

## 7. Conclusion

LeadMates is a scalable and secure solution for lead management. The separation of concerns between the frontend and backend ensures maintainability, while the use of modern libraries provides a high-performance user experience. The system is ready for deployment and further feature expansion.
