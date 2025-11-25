# Supabase Setup Instructions

## Current Issue
Your Supabase project ID is **invalid**: `xsmzadpsiydlnnzecsbw`
- The domain `xsmzadpsiydlnnzecsbw.supabase.co` does NOT exist
- This causes `net::ERR_NAME_NOT_RESOLVED` errors when trying to sign up/login

## Solution: Create a New Supabase Project

### Step 1: Create Free Supabase Project
1. Go to https://supabase.com/dashboard
2. Sign up / Log in (free tier available)
3. Click **"New Project"**
4. Fill in:
   - **Name**: Any name (e.g., "EventHub App")
   - **Database Password**: Generate a strong one
   - **Region**: Pick closest to you (e.g., us-east-1)
5. Click **Create new project**
6. Wait 1-2 minutes for project to initialize

### Step 2: Get Your Credentials
1. Once created, go to **Settings** (left sidebar)
2. Click **API** (under Settings)
3. Copy these three values:

```
VITE_SUPABASE_URL = "Project URL" field
VITE_SUPABASE_PUBLISHABLE_KEY = "Anon public key" field  
VITE_SUPABASE_PROJECT_ID = from the URL (e.g., https://YOUR_PROJECT_ID.supabase.co)
```

### Step 3: Update .env File
Replace the current `.env` with your credentials:

```env
VITE_SUPABASE_PROJECT_ID="your-actual-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-actual-anon-key"
VITE_SUPABASE_URL="https://your-actual-project-id.supabase.co"
```

### Step 4: Restart Dev Server
```bash
# Stop current dev server (Ctrl+C)
# Then restart:
bun dev
```

## Verify It Works
- Open browser console (F12)
- Look for messages like: `[Auth] Supabase URL: https://xxx.supabase.co`
- Try signing up - should work without `ERR_NAME_NOT_RESOLVED` error

## Database Tables Setup (Optional)
If you want to store user profiles with full_name and role:
1. Go to Supabase Dashboard → SQL Editor
2. Create a `profiles` table:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id)
);
```

Then enable Row Level Security in Supabase UI.
