# ValidCheck

**ValidCheck** is a premium Enterprise Check-in and Identity Verification platform designed for high-end events, summits, and secure gatherings. It combines robust security protocols with a sophisticated "SaaS Premium" aesthetic to provide a seamless check-in experience for both organizers and attendees.

## ✨ Features

- **🎯 Precision Verification**: Real-time attendee identity verification via email.
- **🌍 Spatial Security (Geofencing)**: Restrict check-ins to specific geographic locations with customizable radius parameters (Haversine distance calculations).
- **🔁 Recurring Events**: Session-based logic for multi-day events with automatic daily window calculations.
- **📊 Professional Dashboard**: A high-performance "Console" for organizers to manage events, attendees, and live activity streams.
- **📱 Responsive Check-in Portals**: Elegant, mobile-first public portals for attendee self-registration and check-in.
- **🛡️ Audit Logs**: Comprehensive "Stream Activity" logs tracking every administrative and attendee action on the network.
- **💎 Premium Design System**: Expertly crafted UI using Tailwind CSS, Framer Motion, and Radix UI with a signature "Console" aesthetic.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **UI/UX**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/valid-check.git
   cd valid-check
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL="your_postgresql_url"
   JWT_SECRET="your_jwt_secret"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Database Initialization**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Launch Development Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

ValidCheck follows a modern clean-code architecture:
- `src/app/api`: Scalable REST API routes with standardized error handling and security middleware.
- `src/app/(root)`: Public-facing marketing and landing pages.
- `src/app/checkin/[slug]`: Dynamic attendee portals with multi-step verification flows.
- `src/app/dashboard`: Administrative management suite for event architects.
- `src/components/ui`: Atomic design system using Radix primitives.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with precision for the next generation of event management.
