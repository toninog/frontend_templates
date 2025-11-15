# SvelteKit Starter Template

A modern, production-ready SvelteKit starter template with TypeScript, Tailwind CSS, and authentication.

## Features

- **SvelteKit** - Full-stack framework with built-in routing and SSR
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **File-Based Routing** - Automatic routing based on file structure
- **Svelte Stores** - Reactive state management
- **Dark Mode** - Built-in theme switching with persistence
- **Authentication** - JWT-based auth with protected routes
- **Mock API** - Ready-to-run with mock authentication
- **Docker Ready** - Production Dockerfile with Node adapter
- **ESLint** - Code linting

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone or download this template**

```bash
# Option 1: Clone from GitHub (if this is a GitHub repo)
git clone https://github.com/yourusername/sveltekit-starter-template.git my-app
cd my-app

# Option 2: Use degit (fast, no git history)
npx degit yourusername/sveltekit-starter-template my-app
cd my-app
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
│   ├── routes/                  # File-based routing
│   │   ├── +layout.svelte       # Root layout
│   │   ├── +layout.ts           # Layout load function
│   │   ├── +page.svelte         # Home page
│   │   ├── +page.ts             # Home page load
│   │   ├── +error.svelte        # Error/404 page
│   │   ├── login/
│   │   │   └── +page.svelte     # Login page
│   │   ├── register/
│   │   │   └── +page.svelte     # Register page
│   │   ├── dashboard/
│   │   │   ├── +page.svelte     # Dashboard page
│   │   │   └── +page.ts         # Protected route
│   │   └── profile/
│   │       ├── +page.svelte     # Profile page
│   │       └── +page.ts         # Protected route
│   ├── lib/                     # Library code
│   │   ├── components/          # Reusable components
│   │   │   ├── Card.svelte
│   │   │   ├── Navigation.svelte
│   │   │   ├── ThemeToggle.svelte
│   │   │   └── UserMenu.svelte
│   │   ├── stores/              # Svelte stores
│   │   │   ├── auth.ts          # Authentication store
│   │   │   └── theme.ts         # Theme store
│   │   ├── api.ts               # Axios API client
│   │   ├── config.ts            # Application configuration
│   │   └── types.ts             # TypeScript types
│   ├── app.html                 # HTML template
│   └── app.css                  # Global styles + Tailwind
├── static/                      # Static assets
│   └── logo.svg                 # Application logo
├── .env.example                 # Environment variables template
├── Dockerfile                   # Docker production build
├── nginx.conf                   # Nginx configuration (optional)
├── package.json                 # Dependencies and scripts
├── svelte.config.js             # SvelteKit configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # This file
```

## Configuration

### Application Configuration

Edit `src/lib/config.ts` to customize your application:

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
npm run check    # Run type checking
npm run lint     # Run ESLint
```

### Adding New Pages

1. Create a new route directory in `src/routes/`
2. Add `+page.svelte` for the page component
3. Optionally add `+page.ts` for load functions or route protection

```
src/routes/my-page/
├── +page.svelte  # Page component
└── +page.ts      # Optional: load function, route guard
```

4. Add navigation link in `src/lib/components/Navigation.svelte`

### Connecting to Real API

Replace mock API calls in `src/lib/api.ts`:

```typescript
// Before (mock)
return Promise.resolve({ data: mockData })

// After (real API)
return apiClient.get('/endpoint')
```

Update `src/lib/stores/auth.ts` to use real API:

```typescript
export async function login(credentials: LoginCredentials) {
  const response = await api.auth.login(credentials)
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

1. Install appropriate adapter:

```bash
npm install -D @sveltejs/adapter-vercel
# or
npm install -D @sveltejs/adapter-netlify
```

2. Update `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-vercel';
```

3. Deploy via platform CLI or Git integration

## Customization Guide

### 1. Branding

- Update `src/lib/config.ts` with your app name, colors, etc.
- Replace `static/logo.svg` with your logo
- Update `src/app.html` title and meta tags
- Customize colors in `tailwind.config.js`

### 2. Authentication

- Replace mock auth in `src/lib/stores/auth.ts`
- Update API endpoints in `src/lib/api.ts`
- Add proper token refresh logic
- Implement password reset, email verification, etc.

### 3. Styling

- Modify global styles in `src/app.css`
- Update Tailwind utility classes in `tailwind.config.js`
- Use `<style>` blocks for component-specific styles

### 4. Features

- Add new routes in `src/routes/`
- Create reusable components in `src/lib/components/`
- Add API methods in `src/lib/api.ts`
- Define types in `src/lib/types.ts`

## Tech Stack Details

### Core

- **SvelteKit 2.5.0** - Full-stack framework
- **Svelte 5.0.0** - UI framework
- **TypeScript 5.6.2** - Type safety
- **Vite 5.4.8** - Build tool

### State Management

- **Svelte Stores** - Reactive state
- **SvelteKit Load Functions** - Data fetching

### Styling

- **Tailwind CSS 3.4.13** - Utility CSS
- **Lucide Svelte 0.446.0** - Icons

### HTTP & Utils

- **Axios 1.7.7** - HTTP client
- **clsx 2.1.1** - ClassName utilities

## Best Practices

### Code Organization

- Use file-based routing
- Keep components in `$lib/components`
- Store shared logic in `$lib`
- Use load functions for data fetching

### TypeScript

- Define types for all props with `export let`
- Avoid `any` type
- Use interfaces for objects
- Export types from `$lib/types.ts`

### Styling

- Use Tailwind utility classes
- Create custom utilities in `app.css`
- Use `class:` directives for conditional classes
- Maintain dark mode classes consistently

### Performance

- Use SvelteKit's built-in SSR
- Implement proper load functions
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
rm -rf node_modules .svelte-kit build
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
- Check the SvelteKit documentation
- Review the code comments

---

**Happy coding!** Built with SvelteKit, TypeScript, and Vite.
