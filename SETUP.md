# PoetryWorld Setup Guide

Complete step-by-step guide to set up and run PoetryWorld.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (free tier works)
- iOS Simulator (Mac) or Android Emulator or physical device

## Step 1: Clone the Repository

```bash
git clone https://github.com/yasshh-xo/poetryworld-app.git
cd poetryworld-app
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Supabase

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for the project to be ready

### 3.2 Run the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the entire content from `supabase/schema.sql`
3. **IMPORTANT**: Replace `'your-admin-email@example.com'` with your actual email address (the one you'll use to login as admin)
4. Click "Run" to execute the schema

### 3.3 Get Your Supabase Credentials

1. Go to Project Settings > API
2. Copy the following:
   - Project URL (SUPABASE_URL)
   - anon/public key (SUPABASE_ANON_KEY)

## Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com
```

**Example:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_ADMIN_EMAIL=admin@poetryworld.com
```

## Step 5: Run the App

```bash
npm start
```

This will start the Expo development server.

### Running on Different Platforms

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: 
  - Install "Expo Go" app from App Store/Play Store
  - Scan the QR code shown in terminal
- **Web**: Press `w` in the terminal

## Step 6: Create Your Admin Account

1. When the app opens, click "Sign Up"
2. Use the SAME email address you set as `EXPO_PUBLIC_ADMIN_EMAIL`
3. Create a password
4. Check your email for verification link
5. Click the verification link
6. Login with your credentials

You now have admin access! 🎉

## Step 7: Add Your First Poem (Admin Only)

Since you're the admin, you can add poems directly through the Supabase dashboard:

1. Go to Supabase Dashboard > Table Editor
2. Select the `poems` table
3. Click "Insert row"
4. Fill in:
   - title: "Your Poem Title"
   - content: "Your poem content..."
   - author: "Your Name"
   - tags: ["tag1", "tag2"]
5. Click "Save"

The poem will immediately appear in the app!

## Features Overview

### For Admin (You)
- ✅ Upload, edit, delete poems
- ✅ Manage categories and themes
- ✅ Approve/moderate comments
- ✅ Full content control

### For Users (Everyone Else)
- ✅ Browse and read poems
- ✅ Like and bookmark poems
- ✅ Comment on poems
- ✅ Share poems
- ✅ Use AI tools
- ✅ Create collections

## AI Features Setup (Optional)

The AI features currently use mock data. To enable real AI:

1. Get a Google Gemini API key from [ai.google.dev](https://ai.google.dev)
2. Add to `.env`:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```
3. Update `lib/ai-service.ts` to use the real API

## Troubleshooting

### "Cannot connect to Supabase"
- Check your `.env` file has correct credentials
- Ensure Supabase project is active
- Check internet connection

### "Permission denied" errors
- Verify RLS policies are set up correctly
- Check that admin email matches in both `.env` and database schema

### App won't start
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### "Module not found" errors
- Run `npm install` again
- Check that all dependencies are installed

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Customization

### Change Color Scheme
Edit the gradient colors in each screen file:
```typescript
<LinearGradient colors={['#1a0a2e', '#16213e']} />
```

### Add More Categories
Insert into Supabase `categories` table via SQL Editor or Table Editor

### Modify AI Prompts
Edit `lib/ai-service.ts` to customize AI behavior

## Support

For issues or questions:
- Check the README.md
- Review Supabase documentation
- Check Expo documentation

## Next Steps

1. ✅ Set up the database
2. ✅ Configure environment variables
3. ✅ Create admin account
4. ✅ Add your first poems
5. 🎨 Customize the design
6. 🤖 Enable AI features
7. 📱 Build for production
8. 🚀 Deploy to App Store/Play Store

---

**Congratulations! Your PoetryWorld app is ready! 🎉📖**
