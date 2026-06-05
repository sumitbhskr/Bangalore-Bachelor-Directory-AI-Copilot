# 🏙️ Bangalore Bachelor Directory + AI Copilot

A full-stack discovery platform for PG accommodations, tiffin services, and personal cook listings in Bangalore — with an AI-powered natural language search Copilot.

---

## 🗂️ Project Structure

```
bangalore-bachelor/
├── frontend/
│   └── index.html           ← Complete React app (single file, no build needed)
│
└── backend/
    ├── server.js            ← Express app entry point
    ├── .env.example         ← Copy to .env and fill in your keys
    ├── package.json
    ├── models/
    │   ├── User.js          ← User schema (bcrypt, JWT)
    │   ├── Listing.js       ← PG / Tiffin / Cook schema + vector embedding
    │   ├── Review.js        ← Review schema (auto-recalculates ratings)
    │   └── AiFeedback.js    ← AI query + feedback logging
    ├── controllers/
    │   ├── authController.js
    │   ├── listingController.js
    │   ├── reviewController.js
    │   └── aiCopilotController.js  ← RAG + OpenAI embeddings + citations
    ├── routes/
    │   ├── auth.js
    │   ├── listings.js
    │   ├── reviews.js
    │   ├── users.js
    │   └── aiCopilot.js
    ├── middleware/
    │   ├── auth.js          ← JWT protect + role authorize + ownerOrAdmin
    │   └── errorHandler.js  ← Centralized error handling + asyncHandler
    └── config/
        └── cloudinary.js    ← Multer + Cloudinary image upload
```

---

## ⚡ Quick Start

### Step 1: Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary keys, OpenAI key

npm install
npm run dev   # starts on port 5000
```

### Step 2: Open Frontend

Simply open `frontend/index.html` in your browser — no build step required!

OR serve it with:
```bash
npx serve frontend/
```

---

## 🔑 Environment Variables (.env)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `OPENAI_API_KEY` | OpenAI API key (for AI Copilot) |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| PUT | `/api/auth/updateprofile` | Protected |
| PUT | `/api/auth/updatepassword` | Protected |

### Listings
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/listings` | Public |
| GET | `/api/listings/:id` | Public |
| POST | `/api/listings` | Owner/Admin |
| PUT | `/api/listings/:id` | Owner of listing / Admin |
| DELETE | `/api/listings/:id` | Owner of listing / Admin |
| GET | `/api/listings/owner/my` | Owner/Admin |
| PUT | `/api/listings/:id/save` | Protected |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/listings/:id/reviews` | Public |
| POST | `/api/listings/:id/reviews` | Protected |
| PUT | `/api/reviews/:id` | Review Author |
| DELETE | `/api/reviews/:id` | Review Author / Admin |

### AI Copilot
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/ai/query` | Public (rate limited) |
| POST | `/api/ai/feedback/:id` | Public |
| POST | `/api/ai/embed/:listingId` | Admin only |
| POST | `/api/ai/embed-all` | Admin only |

---

## 🧠 AI Copilot Architecture

```
User Query
    │
    ▼
OpenAI text-embedding-3-small
    │ (vector)
    ▼
Cosine Similarity Search
  against Listing.embedding[]
    │
    ▼ (top-5 matches)
RAG Context Builder
    │
    ▼
GPT-3.5-turbo (LLM)
  System: "You are Bangalore Bachelor Copilot..."
  Context: listing details
    │
    ▼
Response + Citations + Confidence Score
    │
    ▼
User Feedback Logging (wasHelpful)
```

**Low confidence fallback**: If cosine similarity < 0.25, returns a helpful "refine your query" message instead of hallucinating.

**Keyword fallback**: If OpenAI key not configured, falls back to regex/text-based search on listings.

---

## 🖼️ Features Implemented

### Frontend (React)
- ✅ Homepage with hero, stats, search bar, type filters
- ✅ Browse page with sidebar filters (type, area, price range, gender, diet)
- ✅ Pagination (client + server-side)
- ✅ Listing detail page with images, amenities, contact
- ✅ Reviews (add, display, star rating)
- ✅ Auth modal (login + register with role selection)
- ✅ Owner Dashboard (CRUD listings, stats)
- ✅ AI Copilot chat widget (floating, persistent, citations)
- ✅ Save/Unsave listings
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Dark theme

### Backend (Express + MongoDB)
- ✅ JWT authentication (register, login, protected routes)
- ✅ Role-based authorization (user, owner, admin)
- ✅ Owner-only listing management
- ✅ Cloudinary image upload (multer)
- ✅ Full-text + filter search with pagination
- ✅ Auto-recalculating ratings from reviews
- ✅ Rate limiting (global + stricter for AI)
- ✅ Centralized error handling
- ✅ Structured JSON responses

### AI Copilot
- ✅ Natural language query processing
- ✅ OpenAI text-embedding-3-small embeddings
- ✅ Cosine similarity vector search
- ✅ RAG (Retrieval Augmented Generation) with GPT-3.5-turbo
- ✅ Answer citations (links to actual listings)
- ✅ Low-confidence fallback message
- ✅ Keyword fallback (works without OpenAI key)
- ✅ User feedback logging (thumbs up/down)
- ✅ Admin: generate embeddings for all listings

---

## 🚀 Next Steps / Enhancements

1. **Convert frontend to proper React app** (Create React App / Vite)
2. **Add Google Maps** for location-based search
3. **Add image gallery** with multi-image upload in UI
4. **Push notifications** for new inquiries
5. **Payment integration** for premium listings
6. **Chat messaging** between owner and tenant
7. **Advanced vector DB** (Pinecone / Weaviate) instead of in-memory cosine sim
8. **Deploy**: Frontend → Vercel/Netlify, Backend → Railway/Render, DB → MongoDB Atlas

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vanilla CSS, DM Serif Display + DM Sans fonts |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Images | Cloudinary + multer-storage-cloudinary |
| AI Search | OpenAI (embeddings + GPT-3.5-turbo), cosine similarity RAG |
| Rate Limiting | express-rate-limit |
| Dev | nodemon |