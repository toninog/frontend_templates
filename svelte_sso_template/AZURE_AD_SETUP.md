# Azure AD Setup Guide

This guide walks you through setting up Microsoft EntraID (Azure AD) authentication for your application.

## Prerequisites

- Azure AD tenant (organization account)
- Administrator access to register applications
- Application domain or localhost for development

## Step 1: Register Your Application

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** (or **Microsoft Entra ID**)
3. Click **App registrations** in the left sidebar
4. Click **New registration**

### Registration Details

- **Name**: Enter your application name (e.g., "My SSO App")
- **Supported account types**: Choose one:
  - **Single tenant**: Only users in your organization (recommended for internal apps)
  - **Multi-tenant**: Users from any Azure AD tenant
  - **Personal accounts**: Include Microsoft personal accounts
- **Redirect URI**:
  - Platform: **Web**
  - URI: `http://localhost:5713/auth/callback` (for development)
  - Click **Register**

## Step 2: Configure Redirect URIs

After registration:

1. Go to **Authentication** in the left sidebar
2. Under **Redirect URIs**, add additional URIs:
   - Development: `http://localhost:5713/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
3. Under **Implicit grant and hybrid flows**, ensure **nothing** is checked (we use Authorization Code flow)
4. Click **Save**

## Step 3: Create Client Secret

1. Go to **Certificates & secrets** in the left sidebar
2. Click **New client secret**
3. Add a description (e.g., "Production secret")
4. Choose expiration period (recommended: 12 months)
5. Click **Add**
6. **IMPORTANT**: Copy the **Value** immediately - you won't be able to see it again
7. Store this securely in your backend `.env` file as `AZURE_CLIENT_SECRET`

## Step 4: API Permissions

1. Go to **API permissions** in the left sidebar
2. By default, **User.Read** is already added (allows reading user profile)
3. For role-based access using groups, add:
   - Click **Add a permission**
   - Select **Microsoft Graph**
   - Select **Delegated permissions**
   - Search for and add:
     - `GroupMember.Read.All` (read user's group memberships)
   - Click **Add permissions**
4. If required, click **Grant admin consent** (requires admin privileges)

## Step 5: Token Configuration (Optional - For Group Claims)

To include group IDs in the token:

1. Go to **Token configuration** in the left sidebar
2. Click **Add groups claim**
3. Select **Security groups** (or **All groups**)
4. Under **ID** and **Access** tokens, select **Group ID**
5. Click **Add**

Note: This step is optional. The backend can fetch groups via Microsoft Graph API even without group claims in the token.

## Step 6: Collect Configuration Values

From your app registration overview page, collect:

1. **Application (client) ID** - Copy this value
2. **Directory (tenant) ID** - Copy this value
3. **Client secret** - You copied this in Step 3

## Step 7: Configure Backend Environment

Create a `.env` file in your backend directory with:

```bash
# Azure AD Configuration
AZURE_CLIENT_ID=your-application-client-id
AZURE_CLIENT_SECRET=your-client-secret-from-step-3
AZURE_TENANT_ID=your-directory-tenant-id
AZURE_REDIRECT_URI=http://localhost:8634/api/v1/auth/callback

# Group to Role Mapping (get group IDs from Azure AD)
AZURE_ADMIN_GROUP=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_MANAGER_GROUP=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
# Users not in these groups will get "user" role by default
```

### Finding Group IDs

1. In Azure Portal, go to **Azure Active Directory**
2. Click **Groups** in the left sidebar
3. Find your group (e.g., "App Admins")
4. Click on the group name
5. Copy the **Object ID** - this is your group ID

## Step 8: Configure Frontend Environment

Create a `.env` file in your frontend directory:

```bash
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=your-application-client-id
VITE_AZURE_TENANT_ID=your-directory-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5713/auth/callback

# API Configuration
VITE_API_BASE_URL=http://localhost:8634/api/v1
```

## Step 9: Test Authentication

1. Start your backend server
2. Start your frontend development server
3. Navigate to `http://localhost:5713`
4. Click "Sign in with Microsoft"
5. You should be redirected to Microsoft login
6. After login, you should be redirected back to `/auth/callback` and then to `/dashboard`

## Troubleshooting

### "AADSTS50011: The redirect URI specified in the request does not match..."

- Verify the redirect URI in your frontend `.env` matches exactly what's configured in Azure AD
- Check for trailing slashes (should not have one)
- Ensure the protocol matches (http vs https)

### "AADSTS700016: Application not found in the directory"

- Verify your `VITE_AZURE_CLIENT_ID` is correct
- Ensure you're using the correct tenant ID

### "AADSTS65001: The user or administrator has not consented to use the application"

- Go to **API permissions** in Azure Portal
- Click **Grant admin consent for [Your Organization]**

### Groups not appearing in token

- Verify group claims are configured in **Token configuration**
- Alternatively, your backend can fetch groups via Microsoft Graph API (recommended)

### User gets "user" role instead of "admin"

- Verify the user is actually a member of the admin group in Azure AD
- Check that the group ID in backend `.env` matches the Azure AD group's Object ID
- Ensure backend is correctly parsing groups from Microsoft Graph API response

## Production Deployment

When deploying to production:

1. Add your production domain to **Redirect URIs** in Azure AD:
   - Example: `https://myapp.com/auth/callback`
2. Update frontend `.env.production`:
   ```bash
   VITE_AZURE_REDIRECT_URI=https://myapp.com/auth/callback
   VITE_API_BASE_URL=https://api.myapp.com/api/v1
   ```
3. Update backend `.env.production`:
   ```bash
   AZURE_REDIRECT_URI=https://api.myapp.com/api/v1/auth/callback
   ```
4. **IMPORTANT**: Production authentication requires HTTPS - HTTP will not work

## Security Best Practices

1. Never commit `.env` files to version control
2. Rotate client secrets regularly (before expiration)
3. Use separate app registrations for development and production
4. Enable multi-factor authentication (MFA) for your organization
5. Regularly audit API permissions
6. Monitor sign-in logs in Azure AD for suspicious activity

## Additional Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [OAuth 2.0 Authorization Code Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [Microsoft Graph API - Groups](https://docs.microsoft.com/en-us/graph/api/resources/group)
