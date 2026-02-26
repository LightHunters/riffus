# Google OAuth2 Backend Setup Guide

This backend now includes Google OAuth2 authentication with Passport.js and JWT tokens. Here's how to set it up:

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth2 credentials from [Google Cloud Console](https://console.cloud.google.com)

## 1. Environment Setup

Create a `.env` file in the `/back_end` directory (copy from `.env.example`):

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/riffus

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000
```

## 2. Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Desktop application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - Your production URL

## 3. Install Dependencies

```bash
cd back_end
npm install
```

## 4. Database Setup

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Create/Migrate Database
```bash
npm run prisma:migrate
```

This will create the necessary tables with the new OAuth fields:
- `email` (unique, optional)
- `googleId` (unique, optional)

## 5. Run the Backend

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`  
Swagger docs: `http://localhost:3000/api/docs`

## Authentication Flow

### 1. Redirect to Google Login
```
GET /auth/google
```

### 2. Google Callback (handled automatically)
```
GET /auth/google/callback?code=...&state=...
```
Returns:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "...",
    "role": "customer",
    "createdAt": "2026-02-25T..."
  }
}
```

### 3. Use Access Token
Include the JWT token in subsequent requests:
```
Authorization: Bearer <access_token>
```

## API Endpoints

### Authentication
- `GET /auth/google` - Redirect to Google login
- `GET /auth/google/callback` - Google OAuth callback (automatic)
- `GET /auth/profile` - Get current user profile (requires JWT)
- `GET /auth/logout` - Logout (requires JWT)

## Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts      # Auth endpoints
│   ├── auth.service.ts         # Auth logic
│   ├── auth.module.ts          # Auth module
│   ├── decorators/             # Custom decorators
│   │   └── current-user.decorator.ts
│   ├── guards/                 # Passport guards
│   │   ├── google-oauth.guard.ts
│   │   └── jwt-auth.guard.ts
│   └── strategies/             # Passport strategies
│       ├── google.strategy.ts
│       └── jwt.strategy.ts
├── users/
│   ├── users.service.ts        # User business logic
│   └── users.module.ts
├── prisma/
│   ├── prisma.service.ts       # Prisma service
│   └── prisma.module.ts
├── common/
│   ├── filters/
│   ├── logger/
│   └── dto/
├── app.module.ts               # Main app module
└── main.ts                     # Entry point
```

## Database Schema (Updated)

The User model now includes OAuth fields:

```prisma
model User {
  id             String         @id @default(cuid())
  email          String?        @unique
  name           String
  googleId       String?        @unique
  avatar         String         @default("")
  membershipType MembershipType @default(Guest)
  role           UserRole       @default(customer)
  orders         Order[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}
```

## Testing OAuth Flow

### Using cURL
```bash
# 1. Get Google login URL (returns redirect)
curl -X GET http://localhost:3000/auth/google

# 2. After Google redirects with code/state, the callback automatically handles it
# and returns JWT token

# 3. Use JWT to access protected routes
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### Using Swagger
1. Go to `http://localhost:3000/api/docs`
2. Click on `/auth/google` endpoint
3. Click "Try it out" → "Execute"
4. You'll be redirected to Google login
5. After authentication, you'll get the access token
6. Use the token in the "Authorize" button at the top

## Common Issues

### "No user from google" error
- Check that your Google OAuth credentials are correct
- Verify the callback URL matches in Google Cloud Console

### JWT parse errors
- Ensure JWT_SECRET is set in your environment
- Token includes valid claims (sub, email, name)

### Database connection errors
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database credentials

## Next Steps

1. **Frontend Integration**: Update your frontend to call `/auth/google` endpoint
2. **Token Storage**: Securely store JWT token on client (httpOnly cookie recommended)
3. **Token Refresh**: Implement refresh token rotation
4. **User Profile**: Extend user profile fields as needed
5. **Rate Limiting**: Add rate limiting for auth endpoints
6. **Security**: Configure CORS properly for production

## Environment Checklist

- [ ] DATABASE_URL environment variable set
- [ ] GOOGLE_CLIENT_ID environment variable set
- [ ] GOOGLE_CLIENT_SECRET environment variable set
- [ ] JWT_SECRET environment variable set
- [ ] Google OAuth redirect URI configured
- [ ] PostgreSQL database created and running
- [ ] Prisma migrations applied

## Support

For issues or questions:
1. Check the error logs
2. Verify environment variables
3. Check Google Cloud Console settings
4. Review Swagger documentation at `/api/docs`
