# LeadMates Project Report

**Date:** 2026-02-26  
**Project Name:** LeadMates  
**Version:** 2.4.0 (Stable)

## 1. Executive Summary

LeadMates is a premium User & Lead Management System engineered to optimize the capture, tracking, and conversion of professional leads. Version 2.4.0 introduces a production-grade security architecture featuring multi-factor authentication, a dynamic lead analysis engine, and a stabilized infrastructure for enterprise-level scaling.

## 2. Technology Stack

### Frontend Application
- **Framework:** React 19 (via Vite)
- **Styling:** TailwindCSS 4, Vanilla CSS, Framer Motion (Premium Animations)
- **State Management:** Context API (Auth, Theme, Search, Notifications)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios (with Interceptors for JWT & Refresh Token handling)
- **Charts:** Recharts for dynamic analytics visualization

### Backend API
- **Runtime:** Node.js v18+
- **Framework:** Express.js 5
- **Database:** MySQL 8.0 (managed via Knex.js query builder)
- **Authentication:** Dual-layer security (JWT + 6-Digit Email OTP 2FA)
- **Mail Engine:** Resend API for high-deliverability transactional emails
- **Security:** Helmet, CORS (with credential support), BCrypt (Password Hashing)

## 3. Core Features

### 3.1 Authentication & Security (Enhanced)
- **Dual-Factor Authentication (2FA):** Mandatory email-based OTP verification for all login sessions.
- **Refresh Token Rotation:** Secure, HTTP-Only cookie strategy to prevent XSS and token theft.
- **Identity Recovery:** Complete Forgot Password / Reset Password workflow with secure token hashing.
- **RBAC (Role-Based Access Control):** Granular, hierarchical permissions for Super Admins, Admins, and Operatives.

### 3.2 Lead Intelligence & Analytics (New)
- **Analysis Engine:** Track campaign ROI, identify top lead sources, and monitor conversion trends.
- **Interactive Dashboard:** Real-time visibility into active leads, project health, and user performance.
- **Notification System:** Global alerts for critical system events and lead movements.

### 3.3 Lead Management
- **Capture & Nurture:** Advanced forms with dynamic custom field mapping.
- **Workflow Automation:** Multi-stage status transitions (New → Contacted → Qualified → Closed).
- **Advanced Filtering:** Precision search and filter capabilities for managing large lead datasets.

### 3.4 Administration & Governance
- **Health Check System:** Integrated monitoring for database connectivity and migration status.
- **User Auditing:** Centralized logging of critical administrative and user actions.
- **Soft Delete (Trash):** Safety mechanism to recover accidentally deleted leads or users.

## 4. Project Structure

### Frontend (`/src`)
- **`api/`**: Centralized service modules with automatic token refresh logic.
- **`components/`**: Reusable UI components including `GalaxyHero` animated backgrounds.
- **`dashboard/`**: Protected portal layouts and analytics modules.
- **`pages/`**: Public and authenticated routes (Home, Login, 2FA-Verify, Analysis).

### Backend (`/backend/src`)
- **`controllers/`**: Service-oriented business logic handlers.
- **`services/`**: Core logic for auth, email delivery, and data processing.
- **`db/migrations/`**: Version-controlled database schema stabilized at v2.4.0.

## 5. Setup & Installation

### Prerequisites
- Node.js (v18+)
- MySQL Server 8.0
- Resend API Key (for transactional emails)

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
    cp .env.example .env  # Configure DB and RESEND_API_KEY
    npm run migrate:latest # Run stabilized migrations
    npm run dev           # Start server on port 5000
    ```

3.  **Frontend Setup:**
    ```bash
    cd ..
    npm install
    npm run dev           # Start frontend on port 5173
    ```

## 6. API Overview

The backend exposes a production-grade RESTful API. Key endpoints include:

-   `POST /api/auth/login`: Initiate 2FA-protected authentication.
-   `POST /api/auth/verify-login-2fa`: Finalize session and issue secure cookies.
-   `GET /api/leads/analysis`: Fetch campaign and performance intelligence.
-   `GET /api/admin/users`: Sanitize and manage system users.

## 7. Conclusion

LeadMates v2.4.0 is a production-ready solution that prioritizes security and data-driven decision-making. The separation of concerns, combined with industrial-standard security patterns (2FA/Rotation), ensures the system is both maintainable and highly secure for enterprise use.

---
