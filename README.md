# 🌟 PoetryWorld

A magical poetry platform with AI-powered features and admin-only content management.

## ✨ Features

### Admin Features (You Only)
- ✍️ Upload, edit, and delete poems
- 🎨 Manage categories, themes, and tags
- ✅ Approve/moderate comments
- 📊 View analytics and user engagement
- 🔒 Complete content control

### User Features (Audience)
- ❤️ Like and save poems
- 💬 Comment on poems
- 📥 Download poems
- 📤 Share across social media
- 🔖 Create favorite collections
- 🔔 Get notifications for new uploads

### 🤖 AI Features

#### 1. Poem Generator AI
Generate custom poems based on:
- Topic
- Mood/emotion
- Style (romantic, classical, modern, tragic)
- Poetic form (free verse, sonnet, haiku, rhyme-based)

#### 2. AI Poem Comparator
Compare two poems with analysis of:
- Style differences
- Theme differences
- Literary techniques
- Depth, emotion, clarity, rhyme, structure
- Similarity percentage score

#### 3. Word Meaning Finder
Tap any word to get:
- Definition
- Synonyms
- Usage examples
- Etymology

#### 4. AI Theme Interpreter
Explains:
- Main theme
- Poet's perspective
- Symbolism and hidden meanings
- Emotional expression
- Line-by-line importance

#### 5. Additional AI Features
- 🎙️ **AI Reciter**: Reads poems in different emotional tones
- ✏️ **AI Rewriter**: Rewrites poems in different styles
- 🎨 **AI Artwork Generator**: Creates artwork from poem themes
- 😊 **AI Mood Detector**: Identifies emotional tone
- 📚 **AI Vocabulary Enhancer**: Suggests poetic vocabulary
- 🏷️ **AI Title Generator**: Creates perfect poem titles

## 🎨 Design Philosophy

PoetryWorld creates an immersive, magical experience:
- Beautiful, colorful UI with smooth transitions
- Dreamy, artistic theme
- Elegant typography
- Floating words and ink-flow animations
- Book-like page turning effects

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yasshh-xo/poetryworld-app.git
cd poetryworld-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env` file with:
\`\`\`
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_ADMIN_EMAIL=your_admin_email
\`\`\`

4. Start the development server:
\`\`\`bash
npm start
\`\`\`

## 📱 Running the App

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## 🗄️ Database Schema

The app uses Supabase with the following tables:
- `poems` - All poem content
- `categories` - Poem categories
- `themes` - Poem themes
- `tags` - Poem tags
- `users` - User profiles
- `likes` - Poem likes
- `bookmarks` - Saved poems
- `comments` - User comments
- `collections` - User-created collections

## 🔐 Security

- Admin-only editing enforced at database level
- Row Level Security (RLS) policies
- Secure authentication
- Content moderation system

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo
- **Routing**: Expo Router
- **Backend**: Supabase
- **AI**: Google Gemini API
- **Animations**: React Native Reanimated
- **UI**: Custom components with Lucide icons

## 📄 License

MIT License - feel free to use this for your poetry platform!

## 👨‍💻 Developer

Created by Kavyansh for PoetryWorld

---

**Made with ❤️ and poetry**
