# PoetryWorld - Quick Start Guide

Get your poetry app running in 15 minutes! ⚡

## 🚀 Super Fast Setup

### 1. Clone & Install (2 minutes)

```bash
git clone https://github.com/yasshh-xo/poetryworld-app.git
cd poetryworld-app
npm install
```

### 2. Set Up Supabase (5 minutes)

1. **Create account**: Go to [supabase.com](https://supabase.com) → Sign up
2. **New project**: Click "New Project" → Name it "PoetryWorld"
3. **Wait**: Project takes 2-3 minutes to initialize
4. **Run schema**: 
   - Go to SQL Editor
   - Copy ALL content from `supabase/schema.sql`
   - **IMPORTANT**: Replace `'your-admin-email@example.com'` with YOUR email
   - Click "Run"
5. **Get credentials**:
   - Settings → API
   - Copy "Project URL" and "anon public" key

### 3. Configure App (2 minutes)

Create `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=paste_your_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=paste_your_key_here
EXPO_PUBLIC_ADMIN_EMAIL=your_email@example.com
```

### 4. Run App (1 minute)

```bash
npm start
```

Press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### 5. Create Account (2 minutes)

1. App opens → Click "Sign Up"
2. Use the SAME email from `.env` file
3. Create password
4. Check email → Click verification link
5. Login

**You're now the admin!** 🎉

### 6. Add First Poem (3 minutes)

Go to Supabase Dashboard:
1. Table Editor → `poems` table
2. Click "Insert row"
3. Fill in:
   ```
   title: "The Road Not Taken"
   content: "Two roads diverged in a yellow wood..."
   author: "Robert Frost"
   tags: ["classic", "life"]
   ```
4. Save

**Poem appears in app instantly!** ✨

## 📱 What You Get

### Admin Powers (You Only)
- ✅ Add/edit/delete poems
- ✅ Manage categories
- ✅ Approve comments
- ✅ Full control

### User Features (Everyone)
- ✅ Browse poems
- ✅ Like & save
- ✅ Comment
- ✅ Share
- ✅ Use AI tools

### 10 AI Tools
1. **Poem Generator** - Create poems
2. **Poem Comparator** - Compare poems
3. **Word Meanings** - Tap to define
4. **Theme Interpreter** - Understand deeply
5. **AI Reciter** - Listen to poems
6. **Poem Rewriter** - Change styles
7. **Artwork Generator** - Create art
8. **Mood Detector** - Detect emotions
9. **Vocabulary Enhancer** - Better words
10. **Title Generator** - Perfect titles

## 🎨 Customization

### Change Colors

Edit any screen file (e.g., `app/(tabs)/index.tsx`):

```typescript
<LinearGradient 
  colors={['#1a0a2e', '#16213e']}  // Change these!
/>
```

### Add Categories

Supabase → `categories` table → Insert:
```
name: "Friendship"
icon: "👥"
color: "#3498db"
```

### Add Themes

Supabase → `themes` table → Insert:
```
name: "Nostalgic"
description: "Memories and past times"
```

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Check `.env` file exists
- Verify credentials are correct
- Restart app: `npm start`

### "Permission denied"
- Make sure admin email matches in:
  - `.env` file
  - Database schema
  - Your signup email

### App won't start
```bash
# Clear cache
expo start -c

# Or reinstall
rm -rf node_modules
npm install
```

## 📚 Next Steps

1. ✅ **Add more poems** - Build your library
2. ✅ **Customize design** - Make it yours
3. ✅ **Test AI features** - Try all 10 tools
4. ✅ **Invite friends** - Get feedback
5. ✅ **Deploy** - See `DEPLOYMENT.md`

## 📖 Documentation

- **Full Setup**: `SETUP.md`
- **All Features**: `FEATURES.md`
- **Deployment**: `DEPLOYMENT.md`
- **Main README**: `README.md`

## 🎯 Key Files

```
poetryworld-app/
├── app/                    # All screens
│   ├── (tabs)/            # Main tabs
│   │   ├── index.tsx      # Home feed
│   │   ├── explore.tsx    # Categories
│   │   ├── ai.tsx         # AI tools
│   │   ├── saved.tsx      # Bookmarks
│   │   └── profile.tsx    # User profile
│   ├── poem/[id].tsx      # Poem detail
│   └── auth/login.tsx     # Login screen
├── lib/
│   ├── supabase.ts        # Database config
│   └── ai-service.ts      # AI features
├── supabase/
│   └── schema.sql         # Database schema
└── .env                   # Your credentials
```

## 💡 Pro Tips

1. **Test on real device** - Better than simulator
2. **Use dark mode** - Looks amazing
3. **Add sample poems** - At least 10-20 for testing
4. **Try all AI tools** - See what they can do
5. **Share with friends** - Get early feedback

## 🆘 Need Help?

1. Check `SETUP.md` for detailed guide
2. Review `FEATURES.md` for all features
3. Read Supabase docs
4. Check Expo docs

## ✅ Checklist

- [ ] Cloned repository
- [ ] Installed dependencies
- [ ] Created Supabase project
- [ ] Ran database schema
- [ ] Created `.env` file
- [ ] Started app
- [ ] Created admin account
- [ ] Added first poem
- [ ] Tested features
- [ ] Customized design

## 🎉 Success!

If you can see poems in your app, you're done! 

**Time to build your poetry empire! 📖✨**

---

**Made with ❤️ for poetry lovers**
