# LeadMates Advanced Security & Functionality Development Prompt

## Project Overview
Implement a robust, production-grade security architecture for LeadMates. This includes Two-Factor Authentication (2FA) for login, secure refresh token rotation using HTTP-only cookies, a complete Forgot Password flow, and enhanced Admin Dashboard privacy.

---

## 1. Authentication & Security Architecture

### A. Two-Factor Authentication (2FA) for Login
**Flow:** `Login -> Validate Credentials -> 2FA Challenge -> Verify OTP -> Issue Tokens -> Dashboard`

1.  **Login Endpoint (`POST /api/auth/login`)**:
    *   **Input:** Email, Password.
    *   **Logic:**
        *   Validate credentials.
        *   **Do NOT** issue full access tokens yet.
        *   Generate a **temporary login token** (short-lived, e.g., 5 mins) payload: `{ userId, type: 'pre-2fa' }`.
        *   Generate and store a 6-digit OTP (Email or Mobile) in `otp_logs`.
        *   Send OTP (Simulate via Console).
    *   **Response:** `{ success: true, require2fa: true, tempToken: "...", message: "OTP sent to registered email/mobile" }`.

2.  **Verify 2FA Endpoint (`POST /api/auth/verify-2fa`)**:
    *   **Input:** `{ tempToken, otp }`.
    *   **Logic:**
        *   Verify `tempToken`.
        *   Validate OTP against `otp_logs` (Check matching userId, expiry, and used status).
        *   If valid: Mark OTP as used.
    *   **Output:** Issue final **Access Token** & **Refresh Token**.

3.  **Resend 2FA OTP (`POST /api/auth/resend-2fa`)**:
    *   **Input:** `{ tempToken }`.
    *   **Logic:** Verify `tempToken`, rate limit (30s), generate new OTP.

### B. Secure Token Management (Refresh Tokens)
**Goal:** mitigate XSS and Token Theft.

1.  **Storage:**
    *   **Access Token:** Stored in Frontend Memory (State/Context) - **NOT** localStorage.
    *   **Refresh Token:** Stored in **HTTP-Only, Secure, SameSite Cookie**.
2.  **Refresh Token Rotation:**
    *   **Database:** Store `refresh_token` hash in `user_sessions` or `users` table to support revocation.
    *   **Endpoint (`POST /api/auth/refresh-token`)**:
        *   Read cookie `refreshToken`.
        *   Validate signature & database presence.
        *   **Rotation:** Issue NEW Access Token AND NEW Refresh Token.
        *   Update cookie with new Refresh Token.
3.  **Logout (`POST /api/auth/logout`)**:
    *   Clear `refreshToken` cookie.
    *   Invalidate token in database.

---

## 2. Feature Enhancements

### A. Forgot Password Flow
1.  **Request Reset (`POST /api/auth/forgot-password`)**:
    *   **Input:** Email.
    *   **Logic:**
        *   Check if email exists.
        *   Generate a secure random token (or 6-digit OTP).
        *   Store hash of token + expiry (10 mins) in DB (`password_reset_tokens` table or similar).
        *   Send Email (Simulate Console).
2.  **Verify & Reset (`POST /api/auth/reset-password`)**:
    *   **Input:** `{ token, newPassword, confirmPassword }`.
    *   **Logic:**
        *   Validate token/OTP.
        *   Validate password strength (Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special).
        *   Hash new password (bcrypt).
        *   Update User password.
        *   **Invalidate all existing Refresh Tokens** (Force logout on all devices).

### B. Admin Dashboard Privacy (Users Page)
1.  **API Update (`GET /api/admin/users`)**:
    *   **Sanitization:** Explicitly select fields. **NEVER** return `password` hash or `refresh_token`.
    *   **Response Fields:** `id`, `name`, `email`, `role`, `is_verified`, `created_at`, `status`.
    *   **Middleware:** Ensure `protect` and `authorize('Admin')` are strictly applied.

---

## 3. Frontend Requirements (React)

### A. 2FA Verification Page
*   **Route:** `/auth/2fa-verify` (Protected by "Pre-Auth" state, not full auth).
*   **State:** accept `tempToken` from Login response.
*   **UI:** 
    *   6-digit OTP Input.
    *   "Resend Code" button with 30s countdown.
    *   On success: Save Access Token to Context -> Redirect to Dashboard.

### B. Forgot Password Pages
1.  **Request Page (`/forgot-password`)**: Simple email input form.
2.  **Reset Page (`/reset-password?token=...`)**:
    *   Inputs: New Password, Confirm Password.
    *   Validation: Real-time strength meter/feedback.

### C. Access Token Interceptors
*   **Axios Interceptor:**
    *   On `401 Unauthorized` -> Call `/refresh-token`.
    *   If Refresh succeeds -> Retry original request.
    *   If Refresh fails -> Logout (Clear state, redirect to login).

### D. UI/UX Polish
*   **Global Loading:** Use a top-bar loader (e.g., NProgress) or overlay for auth actions.
*   **Toasts:** Success/Error notifications for all actions.
*   **Response Handling:** Standardize error display from backend `errors` array.

---

## 4. Backend Implementation Checklist

### Database
- [ ] Create/Update `otp_logs` table (if not exists) for 2FA.
- [ ] Create `password_reset_tokens` table (or fields in User).
- [ ] Remove `refresh_token` column if storing plaintext; ensure hashed storage only.

### Middleware
- [ ] `rateLimiter`: Limit generic Login/OTP attempts (e.g., 5 per minute).
- [ ] `validate2FA`: Middleware to protect routes requiring 2FA (if we want step-up auth later).

### Security Config
- [ ] **CORS**: Allow credentials (cookies) from frontend origin.
- [ ] **Helmet**: Security headers.
- [ ] **Cookie Config**: `{ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' }`.

---

## 5. Development Phases

### Phase 1: Cookie & Token Architecture
*   Modify Login to set Cookie.
*   Create Refresh Endpoint.
*   Update Logout to clear Cookie.
*   Update Frontend Axios Interceptor.

### Phase 2: 2FA Implementation
*   Update Login to return `tempToken` instead of full tokens.
*   Create 2FA Verify Endpoint.
*   Build Frontend 2FA Page.

### Phase 3: Password Recovery
*   Build Forgot/Reset Backend APIs.
*   Build Frontend Pages.
*   Test Expiry and Validation.

### Phase 4: Admin & Cleanup
*   Sanitize Admin User API.
*   Strict Role Middleware checks.
*   Final Security Audit (Headers, Rate Limits).
