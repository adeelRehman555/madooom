# React + TypeScript + Vite + Tailwind + Neon

A modern web application template built with cutting-edge technologies.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite (fast development & optimized builds)
- **Styling**: Tailwind CSS
- **Database**: Neon (serverless PostgreSQL)
- **Type Safety**: TypeScript with strict mode

## 📦 Project Structure

```
src/
├── App.tsx              # Main App component
├── main.tsx             # Entry point
├── index.css            # Tailwind styles
├── lib/
│   ├── database.ts      # Neon database utilities
│   └── api.ts           # API request utilities
├── components/          # React components (create as needed)
└── hooks/               # Custom React hooks (create as needed)
```

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and add your credentials:

```bash
cp .env.example .env.local
```

Then update with your Neon database URL:

```env
VITE_DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-2.neon.tech/dbname
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📚 Quick Start

### Using the Database

```typescript
import { executeQuery, getOne, getAll } from '@/lib/database'

// Execute a query
const users = await executeQuery('SELECT * FROM users WHERE age > $1', [18])

// Get a single record
const user = await getOne('SELECT * FROM users WHERE id = $1', [1])

// Get all records
const allUsers = await getAll('users')
```

### Making API Requests

```typescript
import { api } from '@/lib/api'

// GET request
const data = await api.get('/api/endpoint')

// POST request
const result = await api.post('/api/endpoint', { key: 'value' })

// PUT request
await api.put('/api/endpoint', { key: 'new-value' })

// DELETE request
await api.delete('/api/endpoint')
```

## 🎨 Tailwind CSS

Tailwind is pre-configured. Use any Tailwind class in your components:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello, Tailwind!
</div>
```

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 📝 Next Steps

1. Replace the welcome screen in `src/App.tsx` with your app
2. Create components in `src/components/`
3. Add custom hooks in `src/hooks/`
4. Set up your Neon database schema
5. Configure your backend/serverless functions

## 🔗 Useful Links

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Neon Documentation](https://neon.tech/docs)
- [TypeScript Documentation](https://www.typescriptlang.org)
