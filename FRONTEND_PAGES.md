# 🌐 LeadMates — Frontend Public Pages

> All pages visible **without login** — complete explanation of each page, what it does, and how it works.

---

## 📋 Page Directory

| # | Page | URL | File |
|---|---|---|---|
| 1 | Home | `/` | `src/pages/Home.jsx` |
| 2 | Login | `/login` | `src/pages/LoginPage.jsx` |
| 3 | Signup | `/signup` | `src/pages/SignupPage.jsx` |
| 4 | OTP Verification | `/verify-otp` | `src/pages/OtpVerificationPage.jsx` |
| 5 | 2FA Login | `/auth/2fa` | `src/pages/Login2FAPage.jsx` |
| 6 | Forgot Password | `/forgot-password` | `src/pages/ForgotPasswordPage.jsx` |
| 7 | Reset Password | `/reset-password` | `src/pages/ResetPasswordPage.jsx` |
| 8 | Pricing | `/pricing` | `src/pages/Pricing.jsx` |
| 9 | Checkout | `/checkout` | `src/pages/Checkout.jsx` |
| 10 | Contact | Embedded in `/` | `src/pages/Contact.jsx` |
| 11 | Docs | `/docs` | `src/pages/Docs.jsx` |
| 12 | Workflow | `/workflow` | `src/pages/Workflow.jsx` |
| 13 | Use Cases | `/use-cases` | `src/pages/UseCases.jsx` |
| 14 | Features | `/features` | `src/pages/Feature.jsx` |
| 15 | Legal Policy | `/legal` | `src/pages/LegalPolicy.jsx` |
| 16 | Access Denied | Auto-shown (403) | `src/pages/AccessDenied.jsx` |
| 17 | Not Found | Any unknown URL (404) | `src/pages/NotFound.jsx` |

---

## 1. 🏠 Home Page

**URL:** `/`  
**File:** `src/pages/Home.jsx`

### What It Does
The main **marketing landing page**. A long scrolling page made up of **15 sections** explaining what LeadMates is, who it is for, and why to use it.

### Sections

| # | Section | Content |
|---|---|---|
| 1 | **Hero** | Big headline + "Get Access" & "Login" buttons |
| 2 | **Social Proof** | Company logo trust strip |
| 3 | **Core Problem** | Why websites fail to convert visitors |
| 4 | **What Is LeadMates** | Simple product description |
| 5 | **Why LeadMates** | Key reasons to choose it |
| 6 | **How It Works** | 4-step process |
| 7 | **Built For** | Target audience (and who it is NOT for) |
| 8 | **Practical Benefits** | Business advantages |
| 9 | **Core Features** | Feature highlights |
| 10 | **Comparison** | Traditional website vs LeadMates table |
| 11 | **Real World Feedback** | Testimonials |
| 12 | **Pricing Philosophy** | "One-time, lifetime" message |
| 13 | **FAQ** | Common questions & answers |
| 14 | **Contact Form** | Embedded contact form |
| 15 | **Final CTA** | Last call-to-action button to sign up |

### Key Technical Features
- Fixed **3D Galaxy animated background** (canvas) behind all content
- Every section **fades and slides in** on scroll using `AnimatedSection` (Framer Motion)
- Fully responsive — mobile, tablet, desktop

---

## 2. 🔐 Login Page

**URL:** `/login`  
**File:** `src/pages/LoginPage.jsx`

### What It Does
Allows existing users to **sign in** to their account.

### How It Works
1. User types **Email** and **Password**
2. Fields validate live (on blur and on submit)
3. On submit → calls `authService.login()` → sends `POST /api/auth/login`
4. **Result:**
   - ✅ Success → redirects to `/dashboard` or `/admin/dashboard`
   - 🔒 2FA enabled → saves temp token → redirects to `/auth/2fa`
   - ⚠️ Account not verified → redirects to `/verify-otp`

### Key Features
- Show / Hide password toggle (Eye icon from Heroicons)
- "Forgot Password?" link → goes to `/forgot-password`
- Animated **error banner** slides down using Framer Motion
- Galaxy animated background
- If user came from Pricing page → shows `"AUTHENTICATING FOR [Plan Name]"` at the top
- `"v2.4.0 Stable / System Online"` status line at the bottom

---

## 3. 📝 Signup Page

**URL:** `/signup`  
**File:** `src/pages/SignupPage.jsx`

### What It Does
New users **create their account** through a **3-step animated wizard**.

### Steps

| Step | Fields |
|---|---|
| **Step 1 — Personal Info** | Full Name, Work Email, Phone Number, Role Toggle (User / Admin) |
| **Step 2 — Business Info** | Business Name, Company Website URL, Industry / Sector (dropdown) |
| **Step 3 — Security** | Password + Confirm Password |

### Industry Options (Step 2 Dropdown)
- SaaS / Software
- Real Estate
- Healthcare
- E-commerce
- Hospital

### Password Rules (Step 3)
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (`!@#$%^&*`)

### How It Works
1. Each step validates before allowing "Next"
2. On final submit → calls `authService.signup()` → sends `POST /api/auth/signup`
3. On success → redirects to `/verify-otp?userId=...`

### Key Features
- Animated **progress bar** — 3 blue segments fill as you advance
- Animated **step slide transitions** (slides left/right between steps)
- If user came from Pricing → shows `"PHASE: [Plan Name]"` at top
- Galaxy animated background

---

## 4. ✅ OTP Verification Page

**URL:** `/verify-otp`  
**File:** `src/pages/OtpVerificationPage.jsx`

### What It Does
After signup, the user **verifies their email address** by entering a 6-digit code sent to them.

### How It Works
1. User sees the email address the code was sent to
2. Types the 6-digit code — one digit per box
3. Typing a digit **auto-moves focus** to the next box
4. Backspace **auto-moves back** to the previous box
5. Can **paste** the full code — all 6 boxes fill instantly
6. On submit → calls `authService.verifyOtp()` → redirects to dashboard

### Key Features
- **5-minute countdown timer** — code expires after 5 minutes
- "Resend Code" button — only active when timer reaches 0
- Resend resets the timer to 5 minutes again
- Automatically redirects to `/signup` if no `userId` is found (prevents direct URL access)
- Email is stored in `localStorage` so page refresh does not lose the session

---

## 5. 🔑 Two-Factor Authentication (2FA) Page

**URL:** `/auth/2fa`  
**File:** `src/pages/Login2FAPage.jsx`

### What It Does
For users with **2FA enabled** — after entering their password, they land here to confirm their identity with a second code.

### How It Works
1. Backend sends a 6-digit code via email or SMS
2. User enters the 6-digit code into the 6 boxes
3. On submit → calls `authService.verifyLogin2FA()` → redirects to dashboard

### Key Features
- Same 6-box input pattern as OTP Verification page
- **30-second resend countdown**
- Session is saved in `localStorage` (`temp2fa` key) — page refresh does NOT log the user out
- Clears `temp2fa` from localStorage after successful 2FA

---

## 6. 📧 Forgot Password Page

**URL:** `/forgot-password`  
**File:** `src/pages/ForgotPasswordPage.jsx`

### What It Does
User enters their **registered email** to receive a password reset OTP.

### How It Works
1. User types email → validates it contains `@` and `.`
2. On submit → calls `authService.forgotPassword(email)` → `POST /api/auth/forgot-password`
3. **If backend returns a userId** → redirects directly to `/reset-password?userId=...`
4. **If no userId** → shows "Email Dispatched" animated success screen

### Key Features
- Smooth **form-to-success transition** animation (swaps content in place using Framer Motion)
- Blue gradient line at top of the card
- "Back to Login" link with animated arrow (moves left on hover)
- Envelope icon inside the email input field

---

## 7. 🔄 Reset Password Page

**URL:** `/reset-password`  
**File:** `src/pages/ResetPasswordPage.jsx`

### What It Does
User enters the **OTP from their email** plus their **new password** to complete the reset.

### How It Works
1. `userId` is read from URL query parameter (`?userId=...`)
2. User fills in: OTP code + New Password + Confirm Password
3. On submit → calls `authService.resetPassword(userId, otp, newPassword)`
4. On success → shows success screen → auto-redirects to Login after 3 seconds

### Key Features
- **Live password strength checklist** — 5 rules update in real time as you type:

| Rule | Example |
|---|---|
| At least 8 characters | `password` ✅ |
| One uppercase letter | `Password` ✅ |
| One lowercase letter | `PASSWORD` ❌ |
| One number | `Passw0rd` ✅ |
| One special character | `Passw0rd!` ✅ |

- Submit button is **disabled** until all 5 rules pass AND passwords match
- Animated success screen with green checkmark icon on completion

---

## 8. 💰 Pricing Page

**URL:** `/pricing`  
**File:** `src/pages/Pricing.jsx`

### What It Does
Displays **pricing plans** for two different types of users with a toggle to switch between them.

### Admin Plans

| Plan | Price | Key Feature |
|---|---|---|
| Starter Node | $49 / Lifetime | Up to 5 Users |
| Infrastructure Pro ⭐ | $99 / Lifetime | Up to 25 Users *(Most Popular)* |
| Agency Sovereign | $199 / Lifetime | Unlimited Users |

### User Plans

| Plan | Price | Key Feature |
|---|---|---|
| Identity Basic | Free / Forever | Basic CRM Tools |
| Pro Operative ⭐ | $29 / Lifetime | Priority Lead Alerts *(Most Popular)* |
| Lifetime Elite | $59 / Lifetime | AI Lead Insights |

### How It Works
- **Not logged in** → clicking a plan goes to `/signup` with the plan pre-selected
- **Logged in** → clicking a plan goes to `/checkout` with the plan name passed along

### Key Features
- Animated **tab switch** between Admin / User plans (smooth sliding highlight)
- Cards animate in and out with Framer Motion when switching tabs
- "Most Popular" badge on the middle card
- Cards **lift up** on hover
- Pulsing nebula background animation

---

## 9. 💳 Checkout Page

**URL:** `/checkout`  
**File:** `src/pages/Checkout.jsx`

### What It Does
A **mock payment page** where users finalize their plan purchase.

### What the User Sees
- Selected plan name and price
- Mock credit card form (Card Number, Expiry, CVC — all fields are disabled as this is a demo)
- "CONFIRM & DEPLOY" button

### How It Works
1. Checks if a `plan` was passed in route state — if not, redirects to `/pricing`
2. On submit → simulates a **2-second payment processing delay**
3. Updates the user's plan in `localStorage`
4. Shows "Authorization Confirmed" animated success screen
5. Auto-redirects to dashboard after 2 seconds

### Key Features
- Galaxy animated background
- AES-256 / SSL Secure badges shown at the bottom
- Animated green checkmark success screen
- **Note:** Payment is simulated — not connected to a real payment gateway

---

## 10. 📬 Contact Page

**URL:** Embedded inside the Home page (`/`)  
**File:** `src/pages/Contact.jsx`

### What It Does
A contact form section for visitors to **send a message** to the LeadMates team.

### Form Fields
- Name (labelled "Identity")
- Email (labelled "Signal")
- Message (labelled "Transmission")

### Key Features
- Left info card has a **3D tilt effect** — it physically tilts as you move your mouse over it (using Framer Motion `useMotionValue` and `useTransform`)
- Input **labels float up** above the field when clicked (CSS float label pattern)
- A **blue animated underline** grows across the bottom of the active input
- "Broadcast" button with a paper airplane icon that moves on hover
- **Note:** The form `onSubmit` uses `e.preventDefault()` — it is not yet connected to a backend API

---

## 11. 📖 Docs Page

**URL:** `/docs`  
**File:** `src/pages/Docs.jsx`

### What It Does
A static **documentation and help page** explaining how to use the LeadMates platform features. Reference guide for users.

---

## 12. 🔁 Workflow Page

**URL:** `/workflow`  
**File:** `src/pages/Workflow.jsx`

### What It Does
Explains the **LeadMates workflow** — the step-by-step process of how a lead flows from initial capture through to final conversion.

---

## 13. 🎯 Use Cases Page

**URL:** `/use-cases`  
**File:** `src/pages/UseCases.jsx`

### What It Does
Shows **real-world industry examples** of how LeadMates can be used. Covers sectors like Real Estate, SaaS, Healthcare, and E-commerce.

---

## 14. ✨ Feature Page

**URL:** `/features`  
**File:** `src/pages/Feature.jsx`

### What It Does
A detailed breakdown of individual **product features** with descriptions of what each feature does.

---

## 15. ⚖️ Legal Policy Page

**URL:** `/legal`  
**File:** `src/pages/LegalPolicy.jsx`

### What It Does
Static page containing the **Terms of Service**, **Privacy Policy**, and data governance information.

---

## 16. 🚫 Access Denied Page

**URL:** Shown automatically when role/permission check fails  
**File:** `src/pages/AccessDenied.jsx`

### What It Does
Displayed when a logged-in user tries to access a page or section that their **role or permissions do not allow** (HTTP 403 equivalent).

### Key Features
- Large animated `ShieldAlert` icon (Lucide) — springs in with bounce animation
- `"ACCESS DENIED"` text in large bold red
- Blinking animated Lock icon in the corner of the shield
- Red nebula glow background
- Two action buttons:
  - **"Back to Terminal"** → goes back to `/dashboard`
  - **"Request Clearance"** → goes to `/contact`
- Bottom strip (desktop only): `Sector: Restricted | Status: Flagged | Protocol: 403`

---

## 17. ❌ Not Found Page (404)

**URL:** Any URL that does not exist  
**File:** `src/pages/NotFound.jsx`

### What It Does
Displayed when a user navigates to a **URL that does not exist** in the app.

### Key Features
- Massive **"404"** text with a pulsing blue glow that breathes in and out
- A **scanning line** animates up and down continuously across the numbers
- `"System Error: Path Not Found"` subtitle
- Description: *"The node you are trying to access is unreachable or has been purged from the local cluster."*
- **"Return to Home"** button with hover glow effect
- Dark tech grid overlay for cyber aesthetic
- Blue gradient at the bottom

---

## 🗺️ URL Map

```
/                   →  Home          (15-section marketing landing page)
/login              →  Login         (email + password form)
/signup             →  Signup        (3-step wizard)
/verify-otp         →  OTP Verify    (6-digit code, countdown timer)
/auth/2fa           →  2FA Login     (second factor code entry)
/forgot-password    →  Forgot Pwd    (enter email to receive reset OTP)
/reset-password     →  Reset Pwd     (OTP + new password + strength check)
/pricing            →  Pricing       (Admin & User plan cards)
/checkout           →  Checkout      (mock payment, plan finalization)
/docs               →  Docs          (static help/documentation)
/workflow           →  Workflow      (lead flow explanation)
/use-cases          →  Use Cases     (industry examples)
/features           →  Features      (product feature details)
/legal              →  Legal Policy  (Terms of Service, Privacy Policy)
/access-denied      →  403 Page      (auto-shown on permission failure)
*                   →  404 Page      (any unknown URL)
```

---

*Total: 16 unique public URLs across 17 files (Contact is embedded inside Home)*
