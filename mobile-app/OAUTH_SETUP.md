# OAuth Setup Guide

## Backend Setup

1. Install Google Auth Library:
```bash
cd backend
npm install google-auth-library
```

2. Add to `.env`:
```
GOOGLE_CLIENT_ID=your_google_client_id
```

3. Get Google OAuth credentials:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

## Mobile App Setup

1. Install dependencies:
```bash
cd mobile-app
npm install
```

2. Get Google OAuth Client IDs:
   - Web Client ID (for backend)
   - Android Client ID
   - iOS Client ID
   - Expo Client ID

3. Update `src/screens/LoginScreen.js` with your client IDs:
```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: 'YOUR_EXPO_CLIENT_ID',
  iosClientId: 'YOUR_IOS_CLIENT_ID',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  webClientId: 'YOUR_WEB_CLIENT_ID'
});
```

4. Add to `app.json`:
```json
{
  "expo": {
    "scheme": "taskmanager"
  }
}
```

## Testing

1. Start backend: `cd backend && npm start`
2. Start mobile: `cd mobile-app && npm start`
3. Click "Continue with Google" button
4. Complete Google sign-in flow
5. User will be created/logged in automatically

## How it works

1. User clicks Google login button
2. Expo opens Google OAuth flow
3. User authenticates with Google
4. Google returns ID token
5. Mobile app sends token to backend `/api/oauth/google`
6. Backend verifies token with Google
7. Backend creates/finds user and returns JWT
8. Mobile app stores JWT and navigates to Tasks screen
