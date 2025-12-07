# PoetryWorld - System Architecture

Complete technical architecture and system design documentation.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MOBILE APP (React Native)                │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   Home   │  │ Explore  │  │ AI Tools │  │  Saved   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Navigation Layer (Expo Router)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Business Logic Layer                 │   │
│  │  • Authentication  • State Management  • API Calls    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │   API Gateway   │
                    └─────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                             ↓
┌───────────────────┐                    ┌──────────────────────┐
│  SUPABASE BACKEND │                    │   GOOGLE GEMINI AI   │
│                   │                    │                      │
│  • PostgreSQL DB  │                    │  • Poem Generation   │
│  • Auth Service   │                    │  • Analysis          │
│  • Storage        │                    │  • Comparisons       │
│  • Real-time      │                    │  • Interpretations   │
│  • Row Security   │                    │                      │
└───────────────────┘                    └──────────────────────┘
```

## 📱 Frontend Architecture

### Component Hierarchy

```
App Root
│
├── Splash Screen (index.tsx)
│   └── Animated Logo + Floating Words
│
├── Authentication Flow
│   └── Login/Signup Screen
│
└── Main App (Tabs)
    │
    ├── Home Tab
    │   ├── Poem Feed
    │   ├── Poem Cards
    │   └── Action Buttons
    │
    ├── Explore Tab
    │   ├── Search Bar
    │   ├── Categories Grid
    │   ├── Themes List
    │   └── Tags Cloud
    │
    ├── AI Tools Tab
    │   ├── Tool Cards Grid
    │   └── Tool Modals
    │       ├── Input Form
    │       ├── Processing State
    │       └── Result Display
    │
    ├── Saved Tab
    │   ├── Bookmarks List
    │   └── Liked Poems List
    │
    └── Profile Tab
        ├── User Info
        ├── Admin Controls (conditional)
        └── Settings
```

### State Management

```typescript
// Local State (useState)
- UI states (loading, modals, inputs)
- Form data
- Temporary data

// Supabase Real-time
- Poems list
- Comments
- Likes count
- User data

// AsyncStorage
- User session
- Cached data
- Preferences
```

### Navigation Flow

```
Splash → Auth Check → Login/Signup → Main Tabs
                  ↓
              Logged In
                  ↓
            Main Tabs (Home)
                  ↓
         Poem Detail Screen
                  ↓
         AI Tools / Comments
```

## 🗄️ Database Architecture

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐
│   USERS     │────────→│ USER_PROFILES│
│ (Supabase)  │         │              │
└─────────────┘         └──────────────┘
       │                        │
       │                        │
       ↓                        ↓
┌─────────────┐         ┌──────────────┐
│   POEMS     │←────────│  CATEGORIES  │
│             │         └──────────────┘
│  • title    │
│  • content  │         ┌──────────────┐
│  • author   │←────────│   THEMES     │
│  • tags[]   │         └──────────────┘
└─────────────┘
       │
       ├──────→┌──────────────┐
       │       │    LIKES     │
       │       │  • user_id   │
       │       │  • poem_id   │
       │       └──────────────┘
       │
       ├──────→┌──────────────┐
       │       │  BOOKMARKS   │
       │       │  • user_id   │
       │       │  • poem_id   │
       │       └──────────────┘
       │
       ├──────→┌──────────────┐
       │       │  COMMENTS    │
       │       │  • user_id   │
       │       │  • poem_id   │
       │       │  • approved  │
       │       └──────────────┘
       │
       └──────→┌──────────────┐
               │ COLLECTIONS  │
               │  • user_id   │
               │  • poem_ids[]│
               └──────────────┘
```

### Data Flow

```
User Action → Frontend → Supabase Client → PostgreSQL
                                    ↓
                            RLS Policy Check
                                    ↓
                          Authorized? → Execute
                                    ↓
                            Trigger Functions
                                    ↓
                          Update Counters
                                    ↓
                        Real-time Broadcast
                                    ↓
                          Frontend Update
```

## 🔐 Security Architecture

### Row Level Security (RLS)

```sql
-- Example: Poems Table
┌─────────────────────────────────────────┐
│  SELECT (Read)                          │
│  ✅ Everyone can read                   │
│  Policy: USING (true)                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  INSERT/UPDATE/DELETE (Write)           │
│  ✅ Only admin can write                │
│  Policy: USING (auth.email() = admin)   │
└─────────────────────────────────────────┘
```

### Authentication Flow

```
User → Email/Password → Supabase Auth
                            ↓
                    Generate JWT Token
                            ↓
                    Store in AsyncStorage
                            ↓
                Include in All API Calls
                            ↓
                    Verify on Backend
                            ↓
                Check RLS Policies
                            ↓
                Allow/Deny Access
```

## 🤖 AI Service Architecture

### AI Request Flow

```
User Input → AI Service Layer → Google Gemini API
                                        ↓
                                Process Request
                                        ↓
                                Generate Response
                                        ↓
                                Format Output
                                        ↓
                            Return to Frontend
                                        ↓
                            Display to User
```

### AI Service Structure

```typescript
AIService
│
├── generatePoem()
│   ├── Build prompt
│   ├── Call Gemini API
│   └── Return poem
│
├── comparePoems()
│   ├── Build comparison prompt
│   ├── Call Gemini API
│   └── Parse JSON response
│
├── getWordMeaning()
│   ├── Build definition prompt
│   ├── Call Gemini API
│   └── Return structured data
│
├── interpretTheme()
│   ├── Build analysis prompt
│   ├── Call Gemini API
│   └── Return interpretation
│
└── [6 more AI methods...]
```

## 📊 Data Flow Diagrams

### Poem Viewing Flow

```
User Opens App
      ↓
Load Poems from DB
      ↓
Display in Feed
      ↓
User Taps Poem
      ↓
Navigate to Detail
      ↓
Load Full Poem + Comments
      ↓
Increment View Count
      ↓
Display Content
```

### Like/Bookmark Flow

```
User Taps Like/Bookmark
      ↓
Check Auth Status
      ↓
Insert into likes/bookmarks table
      ↓
Trigger: Update poem counter
      ↓
Real-time: Broadcast update
      ↓
Frontend: Update UI
      ↓
Haptic Feedback
```

### Comment Flow

```
User Writes Comment
      ↓
Submit to Backend
      ↓
Insert with approved=false
      ↓
Notify Admin
      ↓
Admin Reviews
      ↓
Approve/Reject
      ↓
If Approved: Show to All
If Rejected: Delete
```

## 🎨 UI Component Architecture

### Design System

```
Theme
├── Colors
│   ├── Primary: #e94560
│   ├── Background: #1a0a2e
│   ├── Secondary: #16213e
│   └── Accent: #0f3460
│
├── Typography
│   ├── Headings: Serif
│   ├── Body: Serif
│   └── UI: Sans-serif
│
├── Spacing
│   ├── xs: 4px
│   ├── sm: 8px
│   ├── md: 16px
│   ├── lg: 24px
│   └── xl: 32px
│
└── Components
    ├── PoemCard
    ├── CategoryCard
    ├── AIToolCard
    ├── CommentCard
    └── ActionButton
```

### Reusable Components

```
components/
├── PoemCard.tsx
│   ├── Title
│   ├── Author
│   ├── Preview
│   └── Actions
│
├── GradientBackground.tsx
│   └── LinearGradient wrapper
│
├── ActionButton.tsx
│   ├── Icon
│   ├── Label
│   └── Counter
│
└── LoadingState.tsx
    └── Animated spinner
```

## 🔄 Real-time Architecture

### Supabase Real-time

```
Database Change
      ↓
PostgreSQL Trigger
      ↓
Supabase Realtime Server
      ↓
WebSocket Broadcast
      ↓
Connected Clients
      ↓
Update Local State
      ↓
Re-render UI
```

### Subscriptions

```typescript
// Example: Listen to new poems
supabase
  .from('poems')
  .on('INSERT', payload => {
    // Add new poem to feed
    updatePoemsList(payload.new)
  })
  .subscribe()
```

## 📦 Build & Deployment Architecture

### Development Flow

```
Local Development
      ↓
Git Commit
      ↓
Push to GitHub
      ↓
EAS Build (Cloud)
      ↓
Generate .ipa/.aab
      ↓
Download Build
      ↓
Test on Device
      ↓
Submit to Stores
```

### Production Architecture

```
┌─────────────────────────────────────────┐
│         App Store / Play Store          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          User Devices (iOS/Android)      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Supabase (Global CDN)           │
│  • US East (Primary)                    │
│  • EU West (Replica)                    │
│  • Asia Pacific (Replica)               │
└─────────────────────────────────────────┘
```

## 🚀 Performance Optimization

### Strategies

```
1. Database
   ├── Indexed queries
   ├── Pagination (limit/offset)
   └── Cached results

2. Frontend
   ├── Lazy loading
   ├── Image optimization
   ├── Memoization
   └── Virtual lists

3. Network
   ├── Request batching
   ├── Debounced searches
   └── Optimistic updates

4. Caching
   ├── AsyncStorage
   ├── In-memory cache
   └── CDN caching
```

## 📈 Scalability

### Horizontal Scaling

```
Load Balancer
      ↓
┌─────┴─────┬─────────┬─────────┐
│  Server 1 │ Server 2│ Server 3│
└───────────┴─────────┴─────────┘
      ↓
Database Cluster
      ↓
Read Replicas
```

### Capacity Planning

```
Users: 1M
Poems: 100K
Daily Active: 100K
Requests/sec: 1000

Database: 10GB
Storage: 50GB
Bandwidth: 1TB/month
```

## 🔍 Monitoring & Analytics

### Metrics Tracked

```
Performance
├── App load time
├── Screen render time
├── API response time
└── Database query time

Usage
├── Daily active users
├── Session duration
├── Feature usage
└── Retention rate

Business
├── Poem views
├── Likes/bookmarks
├── Comments
└── Shares
```

## 🛠️ Tech Stack Summary

```
Frontend
├── React Native 0.74
├── Expo SDK 51
├── TypeScript 5.3
├── Expo Router 3.5
└── Lucide Icons

Backend
├── Supabase
├── PostgreSQL 15
├── PostgREST API
└── Realtime Server

AI
├── Google Gemini Pro
└── Custom AI Service

DevOps
├── GitHub
├── EAS Build
└── App Store Connect
```

---

**This architecture supports:**
- ✅ Millions of users
- ✅ Real-time updates
- ✅ Secure admin control
- ✅ Fast performance
- ✅ Easy scaling
- ✅ Global deployment

**Built for production. Ready to scale. 🚀**
