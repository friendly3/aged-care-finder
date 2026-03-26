# JCH Pham AusPost Incident Tracker

A secure incident tracking application for courier operations, built with SvelteKit and Supabase.

## Features

- **User Authentication** - Secure login/signup with Supabase Auth
- **Incident Management** - Create, update, and track incidents
- **Team Management** - Manage team leaders and drivers
- **Secure Data Isolation** - Row-Level Security (RLS) ensures users only see their own data
- **Real-time Dashboard** - Analytics and incident overview
- **Facility Management** - Track facility information and compliance

## Tech Stack

- **SvelteKit 2.50.2** - Full-stack framework with SSR
- **Svelte 5** - Reactive components with latest runes
- **Supabase** - Backend, authentication, and database
- **Tailwind CSS** - Responsive styling
- **TypeScript** - Type-safe development
- **Chart.js** - Data visualization

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (create at supabase.com)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5175` and create an account.

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── routes/          # SvelteKit pages and layouts
├── lib/
│   ├── components/  # Reusable Svelte components
│   ├── data/        # Data stores and types
│   └── supabase/    # Database queries and client
└── app.html         # HTML entry point
```

## Security

- ✅ Server-side JWT verification
- ✅ Row-Level Security (RLS) on all tables
- ✅ Protected routes with authentication guards
- ✅ Secure logout with session clearing

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
