# 🚚 Bin Route | Dumpster Rentals & Waste Management Dashboard

Welcome to **Bin Route**, a modern, full-featured Next.js web application and dashboard designed for dependable roll-off dumpster rentals and commercial waste management solutions across Greater Worcester, MA.

---

## ✨ Key Features

### 🛒 Multi-Step Booking & Ordering System
- **Dumpster Estimator & Selection**: Interactive dumpster size selection (10yd, 15yd, 20yd, 30yd, 40yd).
- **Address & Distance Calculation**: Google Places API integration for address autocomplete and service area verification.
- **Dynamic Pricing Sidebar**: Real-time order summary calculation based on delivery location, rental duration, and service type.
- **Success & Invoice Generation**: Order confirmation modal with downloadable PDF invoices generated via `jsPDF`.

### 👤 Customer Dashboard
- **Active Services**: Overview of active dumpster subscriptions and ongoing rentals.
- **Activity Timeline & Schedule**: Interactive schedule views for delivery, swap-out, and pickup requests.
- **Payment History**: View detailed billing statements and invoice records.
- **Profile & Damage Reporting**: Manage account details and submit service requests.

### 🛡️ Admin Management Dashboard
- **Service Area Management**: Map-based service coverage boundaries and ZIP code configurations.
- **Dumpster Inventory**: Manage available roll-off dumpster inventory and pricing tiers.
- **Driver Management**: Driver assignment, scheduling, job completion tracking, and driver activity history.
- **Reports & Analytics**: Comprehensive business reporting and data tables with custom pagination.
- **Content Management**: Manage FAQs, Blog posts, Contact Us inquiries, Terms of Service, and Privacy Policies.

### 🎨 UI & Custom Branding
- **Custom Vector Cursor**: Brand-aligned custom SVG mouse cursors (`/cursor/default.svg` & `/cursor/pointer.svg`) with interactive trailing ring effects.
- **Smooth Motion**: Fluid UI micro-interactions built with Framer Motion.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Library**: React 19
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS v4 & Shadcn/UI
- **Maps & Location**: `@react-google-maps/api` & Google Places API
- **Icons & Animations**: Lucide React & Framer Motion
- **PDF Generation**: jsPDF
- **Notifications**: Sonner

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18+) installed on your machine.

### 2. Installation
Clone the repository and install the dependencies:

```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure the required keys:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_API_BASE_URL=your_backend_api_url
```

### 4. Run Development Server
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3737](http://localhost:3737) in your browser to view the application.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js dev server on port 3737 |
| `npm run build` | Compiles the production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code quality |

---

## 📁 Folder Structure

```
├── app/                      # Next.js App Router (Layouts, Pages, APIs)
│   ├── (commonLayout)/       # Public marketing pages & service booking
│   ├── admin/                # Admin management dashboard routes
│   └── dashboard/            # Customer dashboard routes
├── components/               # Reusable UI components & sections
│   ├── booking/              # Multi-step booking components
│   ├── dashboard/            # Admin & customer dashboard modals/tables
│   ├── sections/             # Landing page sections & heroes
│   └── ui/                   # CustomCursor, Modals, Buttons, Headers
├── feature/                  # Redux slices for user & booking state
├── public/                   # Static assets, branding logos & SVG cursors
├── redux/                    # Redux store provider & RTK Query APIs
└── README.md
```

---

Stay clean, stay modular, and happy coding! 🚛💨
