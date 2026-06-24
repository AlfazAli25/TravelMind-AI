# 🧠 TravelMind AI — Smart Travel Itinerary Generator

> Transform your travel booking documents into intelligent, AI-powered day-by-day itineraries.

![TravelMind AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## ✨ Features

### 📄 Smart Document Upload
- Drag & drop upload for travel documents
- Supports PDF, PNG, JPG, JPEG, WEBP formats
- Multiple file upload with progress tracking
- File preview and validation

### 🤖 AI-Powered Extraction Pipeline
- **Text PDFs** → `pdf-parse` for raw text extraction
- **Scanned PDFs** → Gemini Vision for OCR-like extraction
- **Images** → Direct Gemini Vision processing
- Auto-detects PDF type (text vs scanned)
- Outputs structured JSON with flights, hotels, trains, buses

### 🗺️ Intelligent Itinerary Generation
- Day-by-day activity planning
- Flight schedules & hotel check-ins integrated
- Food & restaurant recommendations
- Local transportation suggestions
- Budget breakdown per day & total
- Cultural tips and travel advice
- Emergency contact information

### ✏️ Extraction Review Screen
- Edit AI-extracted data before generating itinerary
- Add/remove flights, hotels, trains, buses
- Correct dates, destinations, booking details

### 📊 Smart Trip Timeline
- Visual timeline with color-coded activities
- ✈️ Flights · 🏨 Hotels · 🚗 Transport · 🍽️ Food · 📍 Attractions
- Day-by-day tab navigation
- Budget estimates per activity

### 💬 AI Travel Assistant
- Contextual chat powered by your itinerary
- Ask about packing, restaurants, attractions
- Transportation and cultural advice
- Persistent chat history

### 🔗 Public Sharing
- Generate unique share links
- Beautiful public presentation page
- No login required to view

### 📥 PDF Export
- Professional itinerary PDF download
- Complete trip summary and daily schedules

### 🔐 Authentication
- JWT-based auth with bcrypt password hashing
- Protected routes
- Token expiration handling
- Persistent login

### 📱 Dashboard
- Total trips, upcoming, completed, shared stats
- Recent trips overview
- Quick navigation

---

## 🏗️ Architecture

```
TravelMind AI/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Cloudinary, env config
│   │   ├── controllers/     # Thin route handlers
│   │   ├── middleware/       # Auth, error handling, multer
│   │   ├── models/          # Mongoose schemas
│   │   ├── prompts/         # AI prompt templates
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic & AI operations
│   │   ├── utils/           # ApiError, ApiResponse, helpers
│   │   ├── validators/      # Input validation
│   │   └── app.js           # Express app setup
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API layer
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Route pages
│   │   ├── App.jsx          # Router & providers
│   │   ├── main.jsx         # React entry
│   │   └── index.css        # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── package.json              # Monorepo scripts
└── README.md
```

### Data Flow

```
Upload Document → Detect Type → Extract Text/Vision → Gemini Structured Extraction
    → Review Screen → Gemini Itinerary Generation → Timeline View → Share/Export
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB Atlas** account (or local MongoDB)
- **Google Gemini API** key
- **Cloudinary** account

### 1. Clone & Install

```bash
git clone <repository-url>
cd "TravelMind AI – Smart Travel Itinerary Generator"
npm install
npm run install:all
```

### 2. Environment Variables

**Backend** — create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/travelmind
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
CLIENT_URL=http://localhost:5173
```

### 3. Run Development

```bash
# Both frontend & backend
npm run dev

# Or separately:
npm run dev:backend    # Express on :5000
npm run dev:frontend   # Vite on :5173
```

---

## 📡 API Documentation

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Create account |
| POST | `/api/auth/login` | ✗ | Login |
| GET | `/api/auth/me` | ✓ | Get profile |

### Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | ✓ | Upload documents (multipart) |

### Itinerary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/itinerary/generate` | ✓ | Generate itinerary |
| GET | `/api/itinerary` | ✓ | List itineraries |
| GET | `/api/itinerary/stats` | ✓ | Dashboard stats |
| GET | `/api/itinerary/:id` | ✓ | Get itinerary |
| DELETE | `/api/itinerary/:id` | ✓ | Delete itinerary |

### Sharing

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/share/:shareId` | ✗ | Public itinerary |

### Chat

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chat/:itineraryId` | ✓ | Send message |
| GET | `/api/chat/:itineraryId` | ✓ | Chat history |

---

## 🚢 Deployment

### Frontend → Vercel

1. Connect your Git repository
2. Set build directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend → Render

1. Create a new Web Service
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `.env.example`

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS 3, Framer Motion, TanStack Query, React Router, React Dropzone |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Multer, express-validator |
| **AI** | Google Gemini 2.0 Flash (text + vision) |
| **Database** | MongoDB Atlas |
| **Storage** | Cloudinary |
| **Auth** | JWT + bcrypt |

---

## 📸 Screenshots

> *Screenshots will be added after deployment.*

| Page | Description |
|------|-------------|
| Landing Page | Hero with gradient animations |
| Dashboard | Stats cards and recent trips |
| Upload | Drag-and-drop with processing steps |
| Extraction Review | Editable extracted booking data |
| Itinerary Timeline | Day-by-day smart timeline |
| AI Chat | Contextual travel assistant |
| Shared Page | Beautiful public itinerary view |

---

## 📄 License

MIT License — feel free to use and modify for your own projects.
