# React Starter Template

A modern, production-ready React starter template with TypeScript, Vite, Tailwind CSS, and authentication.

## Features

- **React 18** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data fetching and caching
- **Dark Mode** - Built-in theme switching with persistence
- **Authentication** - JWT-based auth with protected routes
- **Mock API** - Ready-to-run with mock authentication
- **Docker Ready** - Multi-stage Dockerfile for production deployment
- **ESLint** - Code linting and formatting

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone or download this template**

```bash
# Option 1: Clone from GitHub (if this is a GitHub repo)
git clone https://github.com/yourusername/react-starter-template.git my-app
cd my-app

# Option 2: Use degit (fast, no git history)
npx degit yourusername/react-starter-template my-app
cd my-app

# Option 3: Use as GitHub template
# Click "Use this template" button on GitHub
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env and update values as needed
```

4. **Start development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to http://localhost:5713

## Mock Authentication

The template includes mock authentication that works out of the box:

- **Login**: Enter any email and password to login
- **Admin Role**: Use an email containing "admin" (e.g., admin@example.com) to get admin role
- **Registration**: Enter any details to create an account

All authentication is localStorage-based and requires no backend.

## Project Structure

```
template/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Card.tsx         # Card component
│   │   ├── Navigation.tsx   # Main navigation bar
│   │   ├── ProtectedRoute.tsx # Route guard
│   │   ├── ThemeToggle.tsx  # Dark mode toggle
│   │   └── UserMenu.tsx     # User dropdown menu
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ThemeContext.tsx # Theme state
│   ├── lib/                 # Utilities and API client
│   │   └── api.ts           # Axios API client
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Dashboard page
│   │   ├── Home.tsx         # Landing page
│   │   ├── Login.tsx        # Login page
│   │   ├── NotFound.tsx     # 404 page
│   │   ├── Profile.tsx      # User profile page
│   │   └── Register.tsx     # Registration page
│   ├── types/               # TypeScript types
│   │   └── index.ts         # Type definitions
│   ├── App.tsx              # Main app component with routing
│   ├── config.ts            # Application configuration
│   ├── index.css            # Global styles and Tailwind
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
│   └── logo.svg             # Application logo
├── .env.example             # Environment variables template
├── Dockerfile               # Docker production build
├── nginx.conf               # Nginx configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Configuration

### Application Configuration

Edit `src/config.ts` to customize your application:

```typescript
export const config = {
  appName: 'My App',                    // Your app name
  appDescription: '...',                // Description
  companyName: 'Example Inc',           // Company name
  logoPath: '/logo.svg',                // Logo path
  primaryColor: '#3b82f6',              // Brand color
  apiBaseUrl: '/api',                   // API base URL
  // ... more configuration options
}
```

### Environment Variables

Create a `.env` file from `.env.example`:

```bash
# API Configuration
VITE_API_BASE_URL=/api

# Development Server
WEB_HOST=0.0.0.0
WEB_PORT=5713

# Backend API (for proxy)
API_HOST=localhost
API_PORT=8634
```

### Tailwind Theme

Customize Tailwind in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
    },
  },
}
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add the route in `src/App.tsx`:

```typescript
<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

3. Add navigation link in `src/components/Navigation.tsx`

### Connecting to Real API

Replace mock API calls in `src/lib/api.ts`:

```typescript
// Before (mock)
return Promise.resolve({ data: mockData })

// After (real API)
return apiClient.get('/endpoint')
```

Update `src/contexts/AuthContext.tsx` to use real API:

```typescript
const login = async (credentials: LoginCredentials) => {
  const response = await api.auth.login(credentials.email, credentials.password)
  const { token, user } = response.data
  // ... handle response
}
```

## Deployment

### Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t my-app .

# Run container
docker run -p 5713:5713 my-app
```

### Environment Variables in Docker

Set build-time variables in Dockerfile:

```dockerfile
ENV VITE_API_BASE_URL=https://api.example.com
```

### Static Hosting (Vercel, Netlify, etc.)

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist/` directory

3. Configure rewrites for SPA routing (example for Vercel):

Create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Customization Guide

### 1. Branding

- Update `src/config.ts` with your app name, colors, etc.
- Replace `public/logo.svg` with your logo
- Update `index.html` title and meta tags
- Customize colors in `tailwind.config.js`

### 2. Authentication

- Replace mock auth in `src/contexts/AuthContext.tsx`
- Update API endpoints in `src/lib/api.ts`
- Add proper token refresh logic
- Implement password reset, email verification, etc.

### 3. Styling

- Modify global styles in `src/index.css`
- Update Tailwind utility classes in `tailwind.config.js`
- Customize component styles in respective files

### 4. Features

- Add new pages in `src/pages/`
- Create reusable components in `src/components/`
- Add API methods in `src/lib/api.ts`
- Define types in `src/types/`

## Tech Stack Details

### Core

- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type safety
- **Vite 5.4.8** - Build tool

### Routing & State

- **React Router 6.26.2** - Routing
- **TanStack Query 5.56.2** - Data fetching
- **React Context** - Global state

### Styling

- **Tailwind CSS 3.4.13** - Utility CSS
- **Lucide React 0.446.0** - Icons

### HTTP & Utils

- **Axios 1.7.7** - HTTP client
- **clsx 2.1.1** - ClassName utilities

## Best Practices

### Code Organization

- One component per file
- Co-locate related files
- Use barrel exports (index.ts) for clean imports
- Keep components small and focused

### TypeScript

- Define types for all props
- Avoid `any` type
- Use interfaces for objects
- Export types from `src/types/`

### Styling

- Use Tailwind utility classes
- Create custom utilities in `index.css`
- Prefer composition over custom CSS
- Use dark mode classes consistently

### Performance

- Lazy load heavy components
- Use React Query for data caching
- Optimize images and assets
- Monitor bundle size

## Troubleshooting

### Port Already in Use

Change the port in `.env`:

```bash
WEB_PORT=3000
```

### TypeScript Errors

Clear cache and rebuild:

```bash
rm -rf node_modules dist
npm install
npm run build
```

### Styling Not Applied

Ensure Tailwind is processing your files. Check `tailwind.config.js` content paths.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this template for any project.

## Support

For questions and support:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Happy coding!** Built with React, TypeScript, and Vite.
