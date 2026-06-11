# KopperConnnect

KopperConnect is a modern frontend application built with React and Vite. It delivers a public marketing site and a dashboard-driven user experience for ambassadors and admins, including blog content, consultation booking, partnership pages, and referral activities.

## Key Features

- Public website with sections for Home, About, Services, Partnership, Blog, Consultation, Contact, and Ambassador program.
- Ambassador experience pages, including registration and an ambassador dashboard.
- Admin dashboard with panels for consultations, blog posts, tickets, FAQs, testimonials, inbox messages, ambassador management, and user settings.
- Blog listing and details powered by React context.
- Client-side routing with `react-router-dom`.
- Tailwind-compatible styling through Vite and `@tailwindcss/vite`.
- Toast notifications for user feedback using `react-toastify`.

## Technology Stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- React Toastify
- Recharts
- UUID

## Repository Structure

```
kopperconnect/       # React frontend application built with Vite
  src/               # Application source code
  public/            # Static assets
  package.json       # Frontend dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm installed

### Install dependencies

```bash
cd kopperconnect
npm install
```

### Run the application

```bash
cd kopperconnect
npm run dev
```

Then open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Available Scripts

From `kopperconnect/`:

- `npm run dev` — Start the Vite development server.
- `npm run build` — Build the production frontend.
- `npm run preview` — Preview the production build locally.
- `npm run lint` — Run ESLint across the frontend source.

## Application Routes

### Public pages

- `/` — Home
- `/about` — About
- `/service` — Services
- `/consultation` — Consultation booking
- `/contact` — Contact us
- `/blog` — Blog listing
- `/blog/:id` — Blog detail
- `/login` — Login page
- `/signup` — Signup page
- `/ambassador` — Ambassador program overview
- `/ambassador/dashboard` — Ambassador dashboard
- `/partnership` — Partnership page
- `/referal-activities` — Referral activities

### Admin pages

- `/admin` or `/admin/dashboard` — Admin dashboard
- `/admin/consultation-settings` — Consultation settings
- `/admin/consultation-bookings` — Consultation bookings
- `/admin/testimonials` — Testimonials management
- `/admin/faq` — FAQ management
- `/admin/inbox` — Inbox
- `/admin/blog` — Blog management
- `/admin/tickets` — Tickets
- `/admin/ambassadors` — Ambassador overview
- `/admin/ambassadors/list` — Ambassador list
- `/admin/ambassadors/:id` — Ambassador detail
- `/admin/users` — Users management
- `/admin/settings` — Settings

## Notes

- The project is currently frontend-only and does not include a backend server.
- The frontend includes context providers for blog and ambassador state management.

## Recommended Improvements

- Add real authentication and session management.
- Persist data in a backend database if backend functionality is added later.
- Add end-to-end tests and API validation.

## License

No license has been assigned to this project yet. All rights reserved.
