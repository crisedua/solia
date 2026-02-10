# Vercel Deployment Setup

## Environment Variables

Go to your Vercel project settings → Environment Variables and add:

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://your-vercel-url.vercel.app/oauth2callback
APP_BASE_URL=https://your-vercel-url.vercel.app
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

**Important:** Replace `your-vercel-url` with your actual Vercel deployment URL.

## Google OAuth Setup

Update your Google Cloud Console OAuth redirect URI to:
```
https://your-vercel-url.vercel.app/oauth2callback
```

## Note on Token Storage

The current serverless implementation doesn't persist tokens. For production, you need to:

1. Use Vercel KV (Redis) for token storage
2. Or use a database like Supabase/PlanetScale
3. Or use Vercel Postgres

Install Vercel KV:
```bash
npm install @vercel/kv
```

Then update the API functions to store/retrieve tokens from KV instead of filesystem.
