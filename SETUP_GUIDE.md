# Cutie Birthday App - Full-Stack Setup Guide

## ✅ What's Done

Your birthday app is now fully configured with:

### Frontend
- ✅ React 18 + TypeScript + Vite (blazingly fast!)
- ✅ Tailwind CSS with beautiful animations
- ✅ All pages created: Login, 2FA, Home, Pictures, Videos, Wishlist
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ AES encryption for credentials

### Backend 
- ✅ Express.js server for secure database operations
- ✅ PostgreSQL (Neon) database connected
- ✅ Cloudinary integration for media fetching
- ✅ API endpoints for syncing and retrieving media

### Database (Neon)
- ✅ New connection string updated
- ✅ Media table setup (images, videos)
- ✅ Auto-sync from Cloudinary on page load

---

## 🚀 How to Run

### Prerequisites
Make sure you have Node.js installed (v16 or higher)

### Step 1: Start the Backend Server
Open a terminal and run:
```bash
npm run server
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Media table initialized
```

### Step 2: Start the Frontend (in a NEW terminal)
```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

### Step 3: Open in Browser
Visit: **http://localhost:5173/**

---

## 📱 Testing the App

### Login Flow
1. Enter nickname: **cutie** (case-insensitive)
2. Select date: **August 18, 2005**
3. Answer 2FA question: **32**
4. You're in! 🎉

### Pictures Page
- Click "Your Pictures" in navbar
- Backend will fetch all images from Cloudinary
- Save them to Neon database
- Display in beautiful carousel
- Navigate with ← → or click thumbnails

### Videos Page  
- Click "Your Videos" in navbar
- All videos from Cloudinary appear
- Play/Pause with speed controls (0.5x to 2x)
- Thumbnail gallery below

### Wishlist Page
- Create birthday wishes
- Add priority (High/Medium/Low)
- Mark as completed
- Data persists in browser (localStorage)

---

## 🔧 Configuration

### Database Connection String
File: `.env.local`
```
VITE_DATABASE_URL=postgresql://neondb_owner:npg_A6ogtUzW0ylD@ep-sparkling-voice-ao8xygo9-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Cloudinary Credentials
File: `.env.local`
```
VITE_CLOUDINARY_CLOUD_NAME=dz7kj0glb
VITE_CLOUDINARY_API_KEY=817126563147378
VITE_CLOUDINARY_API_SECRET=BfWf1hlxi79uUZr7sgDBvhYzfwg
```

---

## 🛠️ Project Structure

```
nibi/
├── src/
│   ├── components/
│   │   ├── Login.tsx          (Birthday login page)
│   │   ├── TwoFA.tsx          (2FA verification)
│   │   ├── Home.tsx           (Welcome screen)
│   │   ├── Navbar.tsx         (Navigation bar)
│   │   ├── Pictures.tsx       (Image gallery)
│   │   ├── Videos.tsx         (Video player)
│   │   └── Wishlist.tsx       (Birthday wishes)
│   ├── lib/
│   │   ├── auth.ts            (AES encryption, auth logic)
│   │   ├── database.ts        (Neon API calls)
│   │   └── cloudinary.ts      (Cloudinary integration)
│   └── index.css              (Tailwind + animations)
├── server.js                  (Express backend)
├── .env.local                 (Database & API keys)
├── package.json               (Dependencies)
└── vite.config.ts            (Frontend build config)
```

---

## 📋 API Endpoints

The backend provides these endpoints:

### GET `/api/health`
- Check if server is running
- Response: `{ status: "Server is running" }`

### POST `/api/sync-media`
- Fetch images/videos from Cloudinary
- Save to Neon database
- Response: `{ success: true, message: "✅ Synced X media items", summary: {...} }`

### GET `/api/media/:type`
- Get media by type ('image' or 'video')
- Response: `{ success: true, data: [...], count: 15 }`

### GET `/api/media`
- Get all media (images + videos)
- Response: `{ success: true, data: [...], count: 25 }`

---

## 🐛 Troubleshooting

### "No images found" Error
1. Make sure backend is running: `npm run server`
2. Check if Cloudinary resources exist
3. Look at browser console for API errors (F12)
4. Verify `.env.local` has correct credentials

### Backend Connection Error
```
❌ Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Neon connection string might be invalid
- Check `.env.local` DATABASE_URL
- Verify Neon project is active

### Images/Videos Not Loading
1. Check browser Console (F12) for CORS errors
2. Verify Cloudinary API key is correct
3. Ensure Neon backend is running
4. Try refreshing the page

### Port Already in Use
If port 5000 or 5173 is already in use:
- Backend: Edit `const port = 5000` in server.js
- Frontend: Edit vite.config.ts port setting

---

## 🎯 Next Steps

After confirming everything works:

1. **Upload Media to Cloudinary**
   - Go to cloudinary.com dashboard
   - Upload your images/videos
   - They'll appear in the app automatically!

2. **Customize**
   - Change colors in Tailwind classes
   - Modify animations in src/index.css
   - Update the date/nickname in src/lib/auth.ts

3. **Deploy**
   - Frontend: Vercel, Netlify, GitHub Pages
   - Backend: Heroku, Railway, Render
   - Database: Neon (already in cloud!)

---

## 📞 Need Help?

If something isn't working:
1. Check the browser console (F12)
2. Check the terminal where backend is running
3. Verify all `.env.local` credentials are correct
4. Try restarting both servers

---

**Happy Birthday! 🎂💝** 
Your special day app is ready! 🎉✨
