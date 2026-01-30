# Backend API Specification

This document specifies the backend API requirements for the SvelteKit Microsoft EntraID SSO Template. Your backend must implement these endpoints to enable authentication.

## Overview

The backend handles OAuth 2.0 Authorization Code Flow with Microsoft EntraID, manages JWT tokens, and maps Azure AD groups to application roles.

## Base URL

All endpoints are relative to your API base URL. Example:
- Development: `http://localhost:8634/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

## Authentication Flow

```
Frontend → POST /auth/login → Backend
Backend → Returns Microsoft authorization URL
Frontend → Redirects user to Microsoft
Microsoft → User authenticates
Microsoft → Redirects to /auth/callback?code=XXX
Frontend → GET /auth/callback?code=XXX → Backend
Backend → Exchanges code for token, returns JWT
Frontend → Stores JWT, calls GET /auth/me
Backend → Returns user info
```

## Required Endpoints

### 1. POST /auth/login

Initiates OAuth flow by returning Microsoft authorization URL.

**Request**:
```http
POST /auth/login
Content-Type: application/json

{
  "redirect_uri": "http://localhost:5713/auth/callback"
}
```

**Response** (200 OK):
```json
{
  "authorization_url": "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?client_id={id}&redirect_uri={uri}&response_type=code&scope=openid%20profile%20email%20User.Read%20GroupMember.Read.All&state={state}"
}
```

**Backend Implementation**:
1. Generate random `state` parameter (CSRF protection)
2. Store `state` in cache/session with expiration (5 minutes)
3. Build Microsoft authorization URL with:
   - `client_id`: Your Azure AD application client ID
   - `redirect_uri`: Frontend callback URL (from request)
   - `response_type`: `code`
   - `scope`: `openid profile email User.Read GroupMember.Read.All`
   - `state`: Generated state parameter
4. Return authorization URL

**Error Response** (400 Bad Request):
```json
{
  "detail": "Invalid redirect_uri"
}
```

---

### 2. GET /auth/callback

Exchanges authorization code for JWT token.

**Request**:
```http
GET /auth/callback?code=AUTHORIZATION_CODE&state=STATE_VALUE
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

**Backend Implementation**:

1. **Validate state parameter**:
   - Verify `state` matches cached value
   - Delete cached state
   - Reject if invalid/missing

2. **Exchange code for Microsoft access token**:
   ```http
   POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
   Content-Type: application/x-www-form-urlencoded

   client_id={AZURE_CLIENT_ID}
   &client_secret={AZURE_CLIENT_SECRET}
   &code={code}
   &redirect_uri={backend_redirect_uri}
   &grant_type=authorization_code
   ```

3. **Fetch user info from Microsoft Graph**:
   ```http
   GET https://graph.microsoft.com/v1.0/me
   Authorization: Bearer {microsoft_access_token}
   ```

   Response:
   ```json
   {
     "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "displayName": "John Doe",
     "mail": "john.doe@company.com",
     "userPrincipalName": "john.doe@company.com"
   }
   ```

4. **Fetch user groups**:
   ```http
   GET https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$select=id,displayName
   Authorization: Bearer {microsoft_access_token}
   ```

   Response:
   ```json
   {
     "@odata.context": "...",
     "value": [
       {
         "id": "group-id-1",
         "displayName": "App Admins"
       },
       {
         "id": "group-id-2",
         "displayName": "App Users"
       }
     ]
   }
   ```

   **Note**: Handle pagination if user has many groups:
   ```json
   {
     "value": [...],
     "@odata.nextLink": "https://graph.microsoft.com/v1.0/..."
   }
   ```

5. **Map groups to roles**:
   ```python
   # Example logic
   user_group_ids = [group['id'] for group in groups['value']]

   if AZURE_ADMIN_GROUP in user_group_ids:
       role = "admin"
   elif AZURE_MANAGER_GROUP in user_group_ids:
       role = "manager"
   else:
       role = "user"  # Default for any organization member
   ```

6. **Create or update user in database**:
   ```sql
   INSERT INTO users (email, name, display_name, role, azure_oid, is_active, created_at, updated_at)
   VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
   ON CONFLICT (email) DO UPDATE SET
     name = EXCLUDED.name,
     display_name = EXCLUDED.display_name,
     role = EXCLUDED.role,
     updated_at = NOW();
   ```

7. **Generate application JWT**:
   ```python
   # Example claims
   payload = {
       "sub": user.id,  # User ID
       "email": user.email,
       "name": user.name,
       "role": user.role,
       "azure_oid": user.azure_oid,
       "exp": datetime.utcnow() + timedelta(days=1),
       "iat": datetime.utcnow()
   }

   token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
   ```

8. **Return JWT to frontend**:
   ```json
   {
     "access_token": "eyJhbGc...",
     "token_type": "bearer",
     "expires_in": 86400
   }
   ```

**Error Responses**:

**401 Unauthorized** (Invalid code or expired):
```json
{
  "detail": "Invalid authorization code"
}
```

**403 Forbidden** (User not authorized):
```json
{
  "detail": "User is not authorized to access this application"
}
```

**400 Bad Request** (Missing/invalid state):
```json
{
  "detail": "Invalid or missing state parameter"
}
```

---

### 3. GET /auth/me

Returns current authenticated user information.

**Request**:
```http
GET /auth/me
Authorization: Bearer {jwt_token}
```

**Response** (200 OK):
```json
{
  "id": 123,
  "email": "john.doe@company.com",
  "name": "John Doe",
  "display_name": "John Doe",
  "role": "admin",
  "azure_oid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "is_active": true,
  "created_at": "2024-01-01T10:00:00Z"
}
```

**Backend Implementation**:
1. Extract JWT from Authorization header
2. Verify JWT signature
3. Decode JWT to get user ID
4. Fetch user from database
5. Return user info

**Error Responses**:

**401 Unauthorized** (Invalid/expired token):
```json
{
  "detail": "Invalid or expired token"
}
```

**404 Not Found** (User not found):
```json
{
  "detail": "User not found"
}
```

---

### 4. POST /auth/refresh

Refreshes JWT token before expiration.

**Request**:
```http
POST /auth/refresh
Authorization: Bearer {jwt_token}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

**Backend Implementation**:
1. Verify current JWT (even if expired, check signature)
2. Extract user ID from JWT
3. Verify user still exists and is active
4. Generate new JWT with fresh expiration
5. Return new JWT

**Error Responses**:

**401 Unauthorized** (Invalid token):
```json
{
  "detail": "Invalid token"
}
```

**403 Forbidden** (User inactive):
```json
{
  "detail": "User account is inactive"
}
```

---

### 5. POST /auth/logout (Optional)

Logs out user (if you want to invalidate tokens on server-side).

**Request**:
```http
POST /auth/logout
Authorization: Bearer {jwt_token}
```

**Response** (204 No Content):
```
(empty response)
```

**Backend Implementation** (optional):
1. Add token to blocklist/revocation list
2. Set expiration on blocklist entry
3. Return success

**Note**: Frontend already clears token from localStorage. This endpoint is only needed if you want server-side token revocation.

---

## Environment Variables

Your backend needs these configuration variables:

```bash
# Azure AD Configuration
AZURE_CLIENT_ID=12345678-1234-1234-1234-123456789012
AZURE_CLIENT_SECRET=your-secret-value-from-azure
AZURE_TENANT_ID=87654321-4321-4321-4321-210987654321
AZURE_REDIRECT_URI=http://localhost:8634/api/v1/auth/callback

# Group to Role Mapping
AZURE_ADMIN_GROUP=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_MANAGER_GROUP=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy

# JWT Configuration
JWT_SECRET=your-random-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# CORS
ALLOWED_ORIGINS=http://localhost:5713,https://yourdomain.com
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user', 'manager')),
    azure_oid VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_azure_oid ON users(azure_oid);
```

---

## CORS Configuration

Your backend must allow requests from the frontend origin.

**Example (FastAPI)**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5713", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Example (Express)**:
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5713', 'https://yourdomain.com'],
  credentials: true
}));
```

---

## Security Best Practices

### 1. State Parameter

Always validate the `state` parameter to prevent CSRF attacks:

```python
# On /auth/login
state = secrets.token_urlsafe(32)
cache.set(f"oauth_state:{state}", user_session_id, ex=300)  # 5 min expiration

# On /auth/callback
cached_session = cache.get(f"oauth_state:{state}")
if not cached_session:
    raise HTTPException(401, "Invalid state")
cache.delete(f"oauth_state:{state}")
```

### 2. JWT Secret

Use a strong random secret for JWT signing:

```bash
# Generate with:
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

### 3. Token Expiration

Set reasonable expiration times:
- Access token: 1-24 hours
- Refresh window: Before last 10% of lifetime

### 4. HTTPS in Production

Enforce HTTPS for all production endpoints:

```python
if not request.is_secure and ENV == "production":
    raise HTTPException(403, "HTTPS required")
```

### 5. Client Secret Protection

Never expose `AZURE_CLIENT_SECRET` to frontend or logs:

```python
# Good
logger.info(f"Auth callback for user {user.email}")

# Bad
logger.info(f"Using client secret: {AZURE_CLIENT_SECRET}")
```

### 6. Group Pagination

Handle pagination when fetching groups:

```python
async def fetch_all_groups(access_token):
    groups = []
    url = "https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group"

    while url:
        response = await http_client.get(url, headers={"Authorization": f"Bearer {access_token}"})
        data = response.json()
        groups.extend(data.get("value", []))
        url = data.get("@odata.nextLink")

    return groups
```

---

## Testing Your Backend

### 1. Test OAuth Initiation

```bash
curl -X POST http://localhost:8634/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"redirect_uri": "http://localhost:5713/auth/callback"}'
```

Expected: Microsoft authorization URL with state parameter

### 2. Test Callback (after getting code from Microsoft)

```bash
curl "http://localhost:8634/api/v1/auth/callback?code=CODE_FROM_MICROSOFT&state=STATE_VALUE"
```

Expected: JWT token in response

### 3. Test /auth/me

```bash
curl http://localhost:8634/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: User information

### 4. Test Token Refresh

```bash
curl -X POST http://localhost:8634/api/v1/auth/refresh \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: New JWT token

---

## Example Implementation (Python/FastAPI)

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import jwt
from datetime import datetime, timedelta

app = FastAPI()
security = HTTPBearer()

@app.post("/auth/login")
async def login(data: dict):
    state = secrets.token_urlsafe(32)
    # Store state in cache
    cache.set(f"oauth_state:{state}", True, ex=300)

    auth_url = (
        f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/authorize?"
        f"client_id={AZURE_CLIENT_ID}&"
        f"redirect_uri={data['redirect_uri']}&"
        f"response_type=code&"
        f"scope=openid%20profile%20email%20User.Read%20GroupMember.Read.All&"
        f"state={state}"
    )

    return {"authorization_url": auth_url}

@app.get("/auth/callback")
async def callback(code: str, state: str):
    # Validate state
    if not cache.get(f"oauth_state:{state}"):
        raise HTTPException(401, "Invalid state")
    cache.delete(f"oauth_state:{state}")

    # Exchange code for Microsoft token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/token",
            data={
                "client_id": AZURE_CLIENT_ID,
                "client_secret": AZURE_CLIENT_SECRET,
                "code": code,
                "redirect_uri": AZURE_REDIRECT_URI,
                "grant_type": "authorization_code"
            }
        )
        ms_token = token_response.json()["access_token"]

        # Fetch user info
        user_response = await client.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {ms_token}"}
        )
        user_data = user_response.json()

        # Fetch groups
        groups_response = await client.get(
            "https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group",
            headers={"Authorization": f"Bearer {ms_token}"}
        )
        groups = [g["id"] for g in groups_response.json()["value"]]

    # Map role
    if AZURE_ADMIN_GROUP in groups:
        role = "admin"
    elif AZURE_MANAGER_GROUP in groups:
        role = "manager"
    else:
        role = "user"

    # Create/update user in database
    user = upsert_user(
        email=user_data["mail"],
        name=user_data["displayName"],
        role=role,
        azure_oid=user_data["id"]
    )

    # Generate JWT
    payload = {
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": 86400
    }

@app.get("/auth/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = get_user_by_id(payload["sub"])
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

---

## Troubleshooting

### "invalid_client" error from Microsoft

- Verify `AZURE_CLIENT_SECRET` is correct
- Check that client secret hasn't expired in Azure Portal
- Ensure `client_id` matches your app registration

### "redirect_uri_mismatch" error

- Verify backend `AZURE_REDIRECT_URI` matches Azure AD configuration exactly
- Check for trailing slashes
- Ensure protocol matches (http vs https)

### Groups not returned from Microsoft Graph

- Verify API permissions are granted in Azure Portal
- Check that admin consent was given
- Ensure user is actually in groups
- Handle pagination for users in many groups

### JWT validation fails

- Check `JWT_SECRET` matches between token generation and validation
- Verify token hasn't expired
- Ensure algorithm matches (HS256)

---

## Additional Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Microsoft Graph API Reference](https://docs.microsoft.com/en-us/graph/api/overview)
- [OAuth 2.0 Authorization Code Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [JWT.io - Token Debugger](https://jwt.io/)

---

**Your backend is ready when all endpoints return expected responses and OAuth flow completes successfully.**
