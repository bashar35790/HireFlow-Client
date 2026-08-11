# HireFlow — Client

Frontend for **HireFlow**, a job & recruitment platform. Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS + HeroUI**.

Connects to the HireFlow API (separate repo). Includes role-based dashboards for job seekers, employers and admins.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4 + [HeroUI](https://heroui.com/) components
- [TanStack Query](https://tanstack.com/query) for server state
- [Axios](https://axios-http.com/) (cookie-based auth, `withCredentials`)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for forms

## Repo Layout

```
client/
├── src/
│   ├── app/               # Routes: home, jobs, dashboard, employer, admin, auth
│   ├── components/        # Layout, auth, jobs, employer, shared UI
│   ├── hooks/             # TanStack Query hooks (useAuth, useJobs, useApplications, ...)
│   ├── lib/               # axios instance, query client, types, format utils
│   └── services/          # typed API service modules
├── .env.example
└── ...standard Next.js config
```

## Getting Started

### 1. Prerequisites

- Node.js >= 20
- The [HireFlow API](https://github.com/bashar35790/HireFlow-API) running locally on `:5000` (or set the API URL below)

### 2. Install and configure

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
```

`.env.local` variables:

| Variable               | Example                  | Description                          |
| ---------------------- | ------------------------ | ------------------------------------ |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:5000`  | Base URL of the HireFlow API         |

### 3. Run

```bash
npm run dev        # http://localhost:3000
# production:
npm run build
npm start
```

## Scripts

| Script         | Description                  |
| -------------- | ---------------------------- |
| `npm run dev`  | Start dev server             |
| `npm run build`| Production build             |
| `npm start`    | Serve production build       |
| `npm run lint` | Run ESLint                   |

## Demo Accounts

After running the API seed, log in with (password `Pass@123`):

- Admin: `admin@hireflow.io` → admin dashboard at `/admin`
- Employer: `sarah@acmecorp.com` → employer dashboard at `/employer`
- Seeker: `alice@example.com` → seeker dashboard at `/dashboard`

## Feature Overview

- **Public**: home, browse/search/filter jobs, job detail, company directory + reviews
- **Job seeker**: register/login, apply, track applications, save jobs, review companies
- **Employer**: company profile, post/edit/delete jobs, view applicants, update application status
- **Admin**: overview stats + manage users, companies, jobs, applications, reviews

## Deployment

The app is a standard Next.js project — deploy on Vercel, Netlify or any Node host. Set `NEXT_PUBLIC_API_URL` to the live API URL.

## License

ISC