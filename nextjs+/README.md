# Next.js Authentication App

Full-fledged authentication system with register and signin pages.

## Features

- ✅ User Registration
- ✅ User Sign In
- ✅ Protected Dashboard
- ✅ JWT Token Management
- ✅ Form Validation
- ✅ Error Handling
- ✅ Responsive Design with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Home page
- `/auth/signin` - Sign in page
- `/auth/register` - Registration page
- `/dashboard` - Protected dashboard (requires authentication)

## API Integration

The app connects to your Express backend at `http://localhost:5000/api` with the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
