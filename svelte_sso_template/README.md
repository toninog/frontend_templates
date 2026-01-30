# SvelteKit Microsoft EntraID SSO Template

A production-ready SvelteKit starter template with Microsoft EntraID (Azure AD) Single Sign-On authentication, OAuth 2.0 Authorization Code flow, and group-based role management.

## Features

- **Microsoft EntraID SSO** - Secure OAuth 2.0 authentication with Microsoft
- **No User Registration** - Users must exist in your Azure AD organization
- **Group-Based Roles** - Backend maps Azure AD groups to application roles (admin, manager, user)
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Automatic redirect for unauthenticated users
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Modern utility-first CSS with dark mode support
- **Responsive Design** - Mobile-friendly UI components
- **Docker Ready** - Production Dockerfile with Node adapter

## Prerequisites

Before using this template, you need:

1. **Azure AD Tenant** - An organization Microsoft account
2. **Azure AD Admin Access** - Permissions to register applications
3. **Node.js 18+** and npm
4. **Backend API** - See [Backend API Requirements](#backend-api-requirements)

## Quick Start

### 1. Azure AD Setup

Follow the detailed guide in [AZURE_AD_SETUP.md](./AZURE_AD_SETUP.md) to:
- Register your application in Azure Portal
- Configure redirect URIs
- Set up API permissions
- Create client secret
- Configure group claims (optional)
- Map Azure AD groups to application roles

### 2. Clone Template

```bash
# Copy this template to your project directory
cp -r /path/to/svelte_sso_template my-sso-app
cd my-sso-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Azure AD configuration:

```bash
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=your-application-client-id-from-azure
VITE_AZURE_TENANT_ID=your-directory-tenant-id-from-azure
VITE_AZURE_REDIRECT_URI=http://localhost:5713/auth/callback

# API Configuration
VITE_API_BASE_URL=http://localhost:8634/api/v1
```

### 5. Start Development Server

```bash
npm run dev
```

Navigate to http://localhost:5713 - you'll see the Microsoft SSO login page.

## Environment Variables

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AZURE_CLIENT_ID` | Application (client) ID from Azure AD | `12345678-1234-1234-1234-123456789012` |
| `VITE_AZURE_TENANT_ID` | Directory (tenant) ID from Azure AD | `87654321-4321-4321-4321-210987654321` |
| `VITE_AZURE_REDIRECT_URI` | OAuth callback URL | `http://localhost:5713/auth/callback` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8634/api/v1` |
| `WEB_PORT` | Frontend development server port | `5713` |

### Backend (.env)

Your backend needs these variables:

| Variable | Description |
|----------|-------------|
| `AZURE_CLIENT_ID` | Same as frontend client ID |
| `AZURE_CLIENT_SECRET` | Client secret from Azure AD (keep secure!) |
| `AZURE_TENANT_ID` | Same as frontend tenant ID |
| `AZURE_REDIRECT_URI` | Backend callback URL (different from frontend) |
| `AZURE_ADMIN_GROUP` | Azure AD group ID for admin role |
| `AZURE_MANAGER_GROUP` | Azure AD group ID for manager role |

## Backend API Requirements

This template requires a backend API that implements these endpoints:

### POST /auth/login

Initiates OAuth flow by returning Microsoft authorization URL.

**Request:**
```json
{
  "redirect_uri": "http://localhost:5713/auth/callback"
}
```

**Response:**
```json
{
  "authorization_url": "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?..."
}
```

### GET /auth/callback

Exchanges authorization code for JWT token.

**Query Parameters:** `code`, `state` (optional)

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

**Backend Responsibilities:**
1. Exchange code for Microsoft access token
2. Fetch user info from Microsoft Graph API (`/me`)
3. Fetch user groups (`/me/transitiveMemberOf`)
4. Map groups to roles (admin, manager, user)
5. Create/update user in database
6. Generate JWT token with user claims
7. Return JWT to frontend

### GET /auth/me

Returns current authenticated user information.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "display_name": "John Doe",
  "role": "admin",
  "azure_oid": "...",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### POST /auth/refresh

Refreshes JWT token.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

See [BACKEND_API.md](./BACKEND_API.md) for complete API specification.

## Authentication Flow

```
1. User clicks "Sign in with Microsoft"
   ↓
2. Frontend calls POST /auth/login
   ↓
3. Backend returns Microsoft authorization URL
   ↓
4. User redirected to Microsoft login
   ↓
5. User authenticates with Microsoft
   ↓
6. Microsoft redirects to /auth/callback?code=...
   ↓
7. Frontend calls GET /auth/callback?code=...
   ↓
8. Backend:
   - Exchanges code for Microsoft token
   - Fetches user info from Microsoft Graph
   - Fetches user groups
   - Maps groups to roles
   - Creates/updates user in database
   - Generates JWT token
   ↓
9. Frontend:
   - Stores JWT in localStorage
   - Calls GET /auth/me to get user info
   - Redirects to /dashboard
```

## Role-Based Authorization

### Backend Group Mapping

Configure Azure AD group-to-role mapping in your backend:

```bash
# Backend .env
AZURE_ADMIN_GROUP=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_MANAGER_GROUP=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
```

**Mapping Logic:**
1. User in admin group → `role: "admin"`
2. User in manager group → `role: "manager"`
3. All other users → `role: "user"` (default)

### Frontend Role Checks

Use role-checking utilities in your components:

```typescript
import { user, isAdmin, hasRole } from '$lib/stores/auth';

// Check if current user is admin
$: if ($isAdmin) {
  // Show admin features
}

// Check multiple roles
$: if ($user && hasRole($user, 'admin', 'manager')) {
  // Show features for admin or manager
}
```

### Finding Azure AD Group IDs

1. Go to Azure Portal → Azure Active Directory → Groups
2. Click on your group (e.g., "App Admins")
3. Copy the **Object ID**
4. Add to backend `.env` as `AZURE_ADMIN_GROUP` or `AZURE_MANAGER_GROUP`

## Project Structure

```
svelte_sso_template/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte          # Root layout with auth initialization
│   │   ├── +page.svelte            # SSO login page
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── +page.svelte    # OAuth callback handler
│   │   ├── dashboard/
│   │   │   ├── +page.svelte        # Dashboard (protected)
│   │   │   └── +page.ts            # Route guard
│   │   └── profile/
│   │       ├── +page.svelte        # User profile (protected)
│   │       └── +page.ts            # Route guard
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Navigation.svelte   # Main navigation
│   │   │   ├── UserMenu.svelte     # User dropdown menu
│   │   │   └── ThemeToggle.svelte  # Dark mode toggle
│   │   ├── stores/
│   │   │   ├── auth.ts             # OAuth authentication store
│   │   │   └── theme.ts            # Theme management
│   │   ├── api.ts                  # API client with OAuth endpoints
│   │   ├── config.ts               # App config with Azure settings
│   │   └── types.ts                # TypeScript types
│   ├── app.html                    # HTML template
│   └── app.css                     # Global styles + Tailwind
├── static/                         # Static assets
├── .env.example                    # Environment variables template
├── AZURE_AD_SETUP.md              # Azure AD configuration guide
├── BACKEND_API.md                 # Backend API specification
├── Dockerfile                      # Production Docker build
├── package.json                    # Dependencies
├── svelte.config.js               # SvelteKit config
├── tailwind.config.js             # Tailwind config
└── README.md                       # This file
```

## Development Guide

### Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5713)
npm run build    # Build for production
npm run preview  # Preview production build
npm run check    # TypeScript type checking
npm run lint     # Run ESLint
```

### Adding Protected Routes

1. Create route in `src/routes/my-route/+page.svelte`
2. Add route guard in `src/routes/my-route/+page.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import config from '$lib/config';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  if (browser) {
    const token = localStorage.getItem(config.auth.tokenStorageKey);
    if (!token) {
      throw redirect(302, '/');
    }
  }
};
```

### Role-Based Route Protection

```typescript
// In +page.ts
export const load: PageLoad = async () => {
  if (browser) {
    const userData = localStorage.getItem(config.auth.userStorageKey);
    if (!userData) throw redirect(302, '/');

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      throw redirect(302, '/dashboard'); // Redirect non-admins
    }
  }
};
```

## Deployment

### Production Environment Variables

Update for production:

```bash
# Frontend .env.production
VITE_AZURE_REDIRECT_URI=https://myapp.com/auth/callback
VITE_API_BASE_URL=https://api.myapp.com/api/v1
```

### Azure AD Production Setup

1. Add production redirect URI in Azure Portal:
   - Go to your app registration → Authentication
   - Add `https://myapp.com/auth/callback`
2. Update backend `.env` with production callback URL
3. Ensure HTTPS is enabled (required for OAuth)

### Docker Deployment

```bash
# Build image
docker build -t my-sso-app .

# Run container
docker run -p 5713:5713 \
  -e VITE_AZURE_CLIENT_ID=your-client-id \
  -e VITE_AZURE_TENANT_ID=your-tenant-id \
  -e VITE_AZURE_REDIRECT_URI=https://myapp.com/auth/callback \
  -e VITE_API_BASE_URL=https://api.myapp.com/api/v1 \
  my-sso-app
```

## Customization

### Branding

Edit `src/lib/config.ts`:

```typescript
export const config = {
  appName: 'Your App Name',
  appDescription: 'Your app description',
  companyName: 'Your Company',
  logoPath: '/logo.svg', // Replace logo in /static
  primaryColor: '#3b82f6',
  // ...
};
```

### Roles

To add new roles:

1. Update `User` type in `src/lib/types.ts`:
```typescript
role: 'admin' | 'user' | 'manager' | 'supervisor' // Add new role
```

2. Add role check helper in `src/lib/stores/auth.ts`:
```typescript
export const isSupervisor = derived(user, ($user) => $user?.role === 'supervisor');
```

3. Configure group mapping in backend

### Styling

- Modify `tailwind.config.js` for theme customization
- Update `src/app.css` for global styles
- Use Tailwind utility classes in components

## Security Considerations

### Token Storage

This template uses `localStorage` for JWT storage. For enhanced security:

- Consider using `httpOnly` cookies (requires backend support)
- Implement token rotation
- Set appropriate token expiration times

### HTTPS Required

OAuth 2.0 requires HTTPS in production:

- Development: `http://localhost` is allowed
- Production: Must use `https://`
- Update redirect URIs accordingly

### CORS Configuration

Configure your backend CORS to allow frontend origin:

```python
# Example for FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### State Parameter

The backend should:
1. Generate random `state` parameter
2. Store in session/cache
3. Validate on callback to prevent CSRF attacks

## Troubleshooting

### "AADSTS50011: Redirect URI mismatch"

- Verify redirect URI in `.env` matches Azure AD configuration exactly
- Check for trailing slashes (should not have one)
- Ensure protocol matches (http vs https)

### "AADSTS700016: Application not found"

- Verify `VITE_AZURE_CLIENT_ID` is correct
- Ensure using correct tenant ID

### User Has Wrong Role

- Verify user is in correct Azure AD group
- Check group ID in backend `.env` matches Azure AD group Object ID
- Ensure backend is fetching and parsing groups correctly

### CORS Errors

- Configure backend to allow frontend origin
- Check `VITE_API_BASE_URL` is correct
- Verify backend CORS middleware is properly configured

### Token Expired

- Implement token refresh in `src/lib/stores/auth.ts`
- Set up automatic refresh before expiration
- Handle 401 responses to trigger refresh or re-login

## Tech Stack

- **SvelteKit 2.5.0** - Full-stack framework
- **Svelte 5.0.0** - Reactive UI framework
- **TypeScript 5.6.2** - Type safety
- **Vite 5.4.8** - Build tool
- **Tailwind CSS 3.4.13** - Utility CSS
- **Lucide Svelte 0.446.0** - Icon library

## Additional Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [OAuth 2.0 Authorization Code Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/overview)
- [SvelteKit Documentation](https://kit.svelte.dev/)

## License

MIT License - free to use for any project.

## Support

- Review [AZURE_AD_SETUP.md](./AZURE_AD_SETUP.md) for Azure configuration
- Check [BACKEND_API.md](./BACKEND_API.md) for API specification
- See [TEMPLATE_SUMMARY.md](./TEMPLATE_SUMMARY.md) for implementation details

---

Built with SvelteKit, TypeScript, and Microsoft EntraID
