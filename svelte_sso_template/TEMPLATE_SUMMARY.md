# SvelteKit Microsoft EntraID SSO Template - Summary

## Template Type

**Authentication**: Microsoft EntraID (Azure AD) Single Sign-On with OAuth 2.0 Authorization Code Flow

This template has been modified from the base `svelte_template` to implement enterprise SSO authentication with Microsoft EntraID. It eliminates user registration and replaces mock authentication with real OAuth flow.

## Key Differences from Base Template

### Removed
- ❌ User registration route (`/register`)
- ❌ Login form with email/password
- ❌ Mock authentication with localStorage simulation
- ❌ `LoginCredentials` and `RegisterData` types
- ❌ `register()` function in auth store

### Added
- ✅ Microsoft SSO login page
- ✅ OAuth callback handler (`/auth/callback`)
- ✅ Real OAuth 2.0 authorization flow
- ✅ Azure AD configuration in `config.ts`
- ✅ JWT token management
- ✅ Group-based role mapping (admin, manager, user)
- ✅ `auth.initialize()` for token validation on startup
- ✅ `auth.handleCallback()` for OAuth code exchange
- ✅ `auth.refreshToken()` for JWT refresh
- ✅ Comprehensive Azure AD setup guide
- ✅ Backend API specification

## Authentication Flow

### User Journey

```
1. User visits app → Redirected to login page (/)
2. Clicks "Sign in with Microsoft"
3. Frontend → POST /auth/login → Backend
4. Backend returns Microsoft authorization URL
5. User redirected to login.microsoftonline.com
6. User authenticates with Microsoft credentials
7. Microsoft redirects to /auth/callback?code=...
8. Frontend extracts code → GET /auth/callback?code=...
9. Backend:
   - Exchanges code for Microsoft token
   - Fetches user from Microsoft Graph (/me)
   - Fetches user groups (/me/transitiveMemberOf)
   - Maps groups to roles (admin/manager/user)
   - Creates/updates user in database
   - Generates JWT with user claims
   - Returns JWT to frontend
10. Frontend:
    - Stores JWT in localStorage
    - Calls /auth/me to get user info
    - Updates auth store
    - Redirects to /dashboard
```

### Technical Flow

**OAuth 2.0 Authorization Code Flow**:
1. Authorization request with `client_id`, `redirect_uri`, `scope`
2. User authenticates with Microsoft
3. Authorization code returned to callback
4. Backend exchanges code for access token (with `client_secret`)
5. Backend uses access token to fetch user data from Microsoft Graph
6. Backend generates application JWT
7. Frontend uses JWT for subsequent API calls

## Project Structure

```
svelte_sso_template/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte          # Auth initialization on mount
│   │   ├── +page.svelte            # SSO login page (not landing page)
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── +page.svelte    # OAuth callback handler (NEW)
│   │   ├── dashboard/              # Protected route
│   │   └── profile/                # Protected route
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Navigation.svelte   # No register link
│   │   │   ├── UserMenu.svelte     # Shows display_name, role
│   │   │   └── ThemeToggle.svelte
│   │   ├── stores/
│   │   │   ├── auth.ts             # OAuth store (MODIFIED)
│   │   │   └── theme.ts
│   │   ├── api.ts                  # OAuth endpoints (MODIFIED)
│   │   ├── config.ts               # Azure config (MODIFIED)
│   │   └── types.ts                # OAuth types (MODIFIED)
│   ├── app.html
│   └── app.css
├── static/
├── .env.example                    # Azure variables (MODIFIED)
├── AZURE_AD_SETUP.md              # Azure setup guide (NEW)
├── BACKEND_API.md                 # API specification (NEW)
├── Dockerfile
├── package.json                    # Updated name/description
├── README.md                       # Complete rewrite
├── TEMPLATE_SUMMARY.md            # This file
└── Other config files
```

## Critical Implementation Files

### 1. `src/lib/stores/auth.ts` (Core Changes)

**Before (Mock)**:
```typescript
export async function login(credentials: LoginCredentials) {
  // Accept any email/password
  // Store mock token and user in localStorage
}

export async function register(data: RegisterData) {
  // Create mock user
}
```

**After (OAuth)**:
```typescript
function createAuthStore() {
  return {
    async initialize() {
      // Load token from localStorage
      // Validate with GET /auth/me
    },

    async login() {
      // Get authorization_url from backend
      // Redirect to Microsoft
    },

    async handleCallback(code: string, state?: string) {
      // Exchange code for JWT via backend
      // Store JWT and fetch user
    },

    async refreshToken() {
      // Refresh JWT before expiration
    },

    logout() {
      // Clear JWT from localStorage
    }
  }
}
```

**Key Differences**:
- No `credentials` parameter in `login()`
- No `register()` function
- Added `initialize()`, `handleCallback()`, `refreshToken()`
- Function-based store pattern (`createAuthStore()`)
- Returns boolean from `handleCallback()` for success/failure

### 2. `src/lib/api.ts` (OAuth Endpoints)

**New Endpoints**:
```typescript
async login(redirectUri: string): Promise<{ authorization_url: string }>
async callback(code: string, state?: string): Promise<AuthResponse>
async refreshToken(): Promise<AuthResponse>
async getCurrentUser(): Promise<User>
```

**Removed**:
- Mock auth endpoints with email/password

### 3. `src/lib/config.ts` (Azure Configuration)

**Added Section**:
```typescript
azure: {
  clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
  tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
  redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || '/auth/callback'
}
```

**Modified**:
- `auth.tokenStorageKey`: 'sso_token' (was 'auth_token')
- `auth.userStorageKey`: 'sso_user' (was 'user_data')
- `routes.login`: '/' (was '/login')
- `routes.callback`: '/auth/callback' (new)
- `features.enableRegistration`: false (was true)
- `features.ssoProvider`: 'microsoft' (new)

### 4. `src/lib/types.ts` (OAuth Types)

**Updated User Interface**:
```typescript
interface User {
  id: string | number
  email: string
  name: string
  display_name?: string      // Microsoft display name (NEW)
  role: 'admin' | 'user' | 'manager'  // Added 'manager'
  azure_oid?: string        // Azure AD Object ID (NEW)
  is_active?: boolean       // (NEW)
  createdAt?: string
}
```

**Removed**:
- `LoginCredentials` interface
- `RegisterData` interface

**Added**:
- `OAuthCallbackParams` interface
- `AuthState` interface
- Updated `AuthResponse` for OAuth tokens

### 5. `src/routes/+page.svelte` (Login Page)

**Before**: Marketing landing page with features
**After**: Centered SSO login page with:
- App logo and name
- "Sign in with Microsoft" button
- Loading state during redirect
- Error message display
- Auto-redirect if authenticated

### 6. `src/routes/auth/callback/+page.svelte` (NEW)

Handles OAuth callback:
- Extracts `code`, `state`, `error` from URL
- Calls `auth.handleCallback(code, state)`
- Shows loading spinner
- Displays error if auth fails
- Redirects to `/dashboard` on success

### 7. `src/routes/+layout.svelte` (Auth Initialization)

**Added**:
```typescript
onMount(async () => {
  await auth.initialize()  // Validate token on app startup
})

// Redirect unauthenticated users to /
$: if (browser && !$isAuthenticated && !isPublicPath) {
  goto('/')
}
```

## Role-Based Authorization

### Backend Responsibility

Backend maps Azure AD groups to application roles:

```bash
# Backend .env
AZURE_ADMIN_GROUP=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_MANAGER_GROUP=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
```

**Mapping Logic**:
1. Fetch user groups from Microsoft Graph API
2. Check if user in admin group → `role: "admin"`
3. Else check if user in manager group → `role: "manager"`
4. Else → `role: "user"` (default for any organization member)

### Frontend Role Helpers

```typescript
// Exported from src/lib/stores/auth.ts
export const isAdmin = derived(user, ($user) => $user?.role === 'admin')
export const isManager = derived(user, ($user) => $user?.role === 'manager')
export const isUser = derived(user, ($user) => $user?.role === 'user')

export function hasRole(user: User | null, ...roles: ('admin' | 'user' | 'manager')[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}
```

## Backend API Requirements

This template requires a backend API. See [BACKEND_API.md](./BACKEND_API.md) for complete specification.

### Minimum Required Endpoints

1. **POST /auth/login** - Returns Microsoft authorization URL
2. **GET /auth/callback** - Exchanges code for JWT
3. **GET /auth/me** - Returns current user
4. **POST /auth/refresh** - Refreshes JWT token

### Backend Responsibilities

1. Register with Azure AD as confidential client
2. Store `AZURE_CLIENT_SECRET` securely
3. Generate `state` parameter for CSRF protection
4. Exchange authorization code for Microsoft access token
5. Fetch user info from Microsoft Graph (`/me`)
6. Fetch user groups (`/me/transitiveMemberOf`)
7. Map groups to roles
8. Create/update user in database
9. Generate application JWT with claims
10. Validate JWT on protected endpoints

## Environment Variables

### Frontend (.env)

```bash
VITE_AZURE_CLIENT_ID=12345678-1234-1234-1234-123456789012
VITE_AZURE_TENANT_ID=87654321-4321-4321-4321-210987654321
VITE_AZURE_REDIRECT_URI=http://localhost:5713/auth/callback
VITE_API_BASE_URL=http://localhost:8634/api/v1
```

### Backend (.env)

```bash
AZURE_CLIENT_ID=12345678-1234-1234-1234-123456789012
AZURE_CLIENT_SECRET=super_secret_value_from_azure
AZURE_TENANT_ID=87654321-4321-4321-4321-210987654321
AZURE_REDIRECT_URI=http://localhost:8634/api/v1/auth/callback
AZURE_ADMIN_GROUP=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_MANAGER_GROUP=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
```

**Important**: Frontend and backend redirect URIs are different!
- Frontend: Where Microsoft sends the user (with code)
- Backend: Where backend exchanges code for token

## Configuration Checklist

### Azure AD Setup

- [ ] Create app registration in Azure Portal
- [ ] Copy Application (client) ID
- [ ] Copy Directory (tenant) ID
- [ ] Create client secret
- [ ] Add redirect URIs (frontend and backend)
- [ ] Set API permissions (User.Read, GroupMember.Read.All)
- [ ] Grant admin consent for permissions
- [ ] Optional: Configure group claims in token configuration

### Frontend Setup

- [ ] Copy `.env.example` to `.env`
- [ ] Set `VITE_AZURE_CLIENT_ID` from Azure
- [ ] Set `VITE_AZURE_TENANT_ID` from Azure
- [ ] Set `VITE_AZURE_REDIRECT_URI` (match Azure config)
- [ ] Set `VITE_API_BASE_URL` to backend API
- [ ] Run `npm install`
- [ ] Run `npm run dev`

### Backend Setup

- [ ] Set all Azure environment variables
- [ ] Configure CORS to allow frontend origin
- [ ] Implement all required API endpoints
- [ ] Store `AZURE_CLIENT_SECRET` securely
- [ ] Create database tables for users
- [ ] Test OAuth flow end-to-end

### Production Deployment

- [ ] Update redirect URIs in Azure AD for production domain
- [ ] Update frontend `.env.production` with HTTPS URLs
- [ ] Update backend `.env.production` with HTTPS URLs
- [ ] Ensure HTTPS is enabled (required for OAuth)
- [ ] Test authentication flow in production
- [ ] Verify group-to-role mapping
- [ ] Monitor Azure AD sign-in logs

## Security Considerations

### Token Storage

**Current**: localStorage (simple, works for most cases)
**Enhanced**: httpOnly cookies (requires backend support, more secure)

### HTTPS Requirement

OAuth 2.0 requires HTTPS in production:
- Development: `http://localhost` is allowed
- Production: Must use `https://` URLs

### State Parameter

Backend should generate and validate `state` parameter to prevent CSRF attacks.

### Token Expiration

Implement token refresh before expiration to avoid user interruption.

### Group Pagination

Backend must handle pagination when fetching groups from Microsoft Graph (users can be in many groups).

## Common Customizations

### Add New Role

1. Update `User` type in `src/lib/types.ts`:
```typescript
role: 'admin' | 'user' | 'manager' | 'supervisor'
```

2. Add role helper in `src/lib/stores/auth.ts`:
```typescript
export const isSupervisor = derived(user, ($user) => $user?.role === 'supervisor')
```

3. Add group mapping in backend:
```bash
AZURE_SUPERVISOR_GROUP=zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz
```

### Change Branding

Edit `src/lib/config.ts`:
```typescript
appName: 'Your App Name'
companyName: 'Your Company'
logoPath: '/your-logo.svg'
primaryColor: '#your-color'
```

### Add Role-Based Route Protection

```typescript
// In +page.ts
export const load: PageLoad = () => {
  if (browser) {
    const userData = localStorage.getItem('sso_user')
    if (!userData) throw redirect(302, '/')

    const user = JSON.parse(userData)
    if (!['admin', 'manager'].includes(user.role)) {
      throw redirect(302, '/dashboard')
    }
  }
}
```

## Testing the Template

### Without Backend

The template will build and run, but authentication will fail without a backend. You'll see:
- Login page loads correctly
- Clicking "Sign in with Microsoft" fails with API error
- Need backend to complete OAuth flow

### With Backend

1. Set up Azure AD app registration
2. Configure frontend `.env`
3. Implement backend endpoints
4. Configure backend `.env`
5. Run both frontend and backend
6. Navigate to http://localhost:5713
7. Click "Sign in with Microsoft"
8. Authenticate with Microsoft
9. Get redirected to /dashboard

## Documentation Files

- **README.md** - Complete setup and usage guide
- **AZURE_AD_SETUP.md** - Step-by-step Azure AD configuration
- **BACKEND_API.md** - Backend API specification
- **TEMPLATE_SUMMARY.md** - This file (implementation overview)
- **.env.example** - Required environment variables with examples

## Success Criteria

- [ ] Frontend builds without TypeScript errors
- [ ] Login page displays correctly
- [ ] OAuth callback handler exists
- [ ] Auth store implements OAuth flow
- [ ] API client has OAuth endpoints
- [ ] Config includes Azure settings
- [ ] Types updated for SSO
- [ ] No references to registration
- [ ] Documentation complete
- [ ] Environment variables documented

## Next Steps

1. **Complete Azure AD Setup**: Follow [AZURE_AD_SETUP.md](./AZURE_AD_SETUP.md)
2. **Implement Backend**: Follow [BACKEND_API.md](./BACKEND_API.md)
3. **Configure Environment**: Copy and edit `.env.example`
4. **Test Authentication**: Run full OAuth flow
5. **Customize Branding**: Update `src/lib/config.ts`
6. **Deploy**: Use Docker or platform of choice

---

**Template Ready**: Start by configuring Azure AD, then implement the backend API.
