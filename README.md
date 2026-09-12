# 🎯 GitPolish – AI Code Intelligence & Resume Platform

Analyzes GitHub repositories using **4 parallel AI agents** to auto-generate code reviews, documentation, and resume-ready bullet points. Built with the MERN stack and Google's Gemini AI, featuring secure authentication, real-time progress updates, and persistent analysis history.

---

## ✨ Features

- 🤖 **Multi-Agent AI Analysis** — 4 specialized agents run in parallel:
  - **Code Review** — detects bugs, security vulnerabilities, and best-practice violations
  - **Documentation Generator** — auto-generates summaries, function docs, and README content
  - **Resume Bullet Generator** — converts code into resume-ready achievement bullets
  - **Auto-Fix** — produces a corrected version of the code with an explanation of changes
- 🔐 **Authentication** — JWT-based login/signup with bcrypt password hashing
- 📊 **Analysis History** — every analysis is saved to MongoDB and can be revisited, expanded, or deleted
- 👤 **User Profiles** — editable name/bio, auto-generated avatar, password change, and usage stats
- ⚡ **Real-Time Progress** — Socket.io streams live status updates while agents are working
- 🔗 **GitHub Integration** — fetches live repository/file content via the GitHub REST API

---

## 🛠️ Tech Stack

**Frontend:** React, React Router, Axios, Socket.io-client
**Backend:** Node.js, Express, Socket.io
**Database:** MongoDB, Mongoose
**AI:** Google Gemini API
**Auth:** JWT, bcrypt
**External API:** GitHub REST API

---

## 🏗️ Architecture

```
User submits a GitHub file URL
        ↓
Backend fetches raw code via GitHub API
        ↓
4 AI agents process the code in parallel (Promise.all)
        ↓
Results are combined, saved to MongoDB, and returned
        ↓
Frontend displays results in structured, styled cards
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free tier works)
- Google Gemini API key
- GitHub Personal Access Token

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```
PORT=5000
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend:
```bash
nodemon server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
gitpolish/
├── backend/
│   ├── models/          # Mongoose schemas (User, AnalysisHistory)
│   ├── Middleware/       # JWT auth middleware
│   └── server.js         # Express + Socket.io server, all API routes
└── frontend/
    └── src/
        ├── pages/         # Login, Signup, Dashboard, History, Profile
        └── components/    # Navbar, ProtectedRoute
```

---

## 🔒 Security Notes

- Passwords are hashed using bcrypt before storage
- Protected routes require a valid JWT token
- Sensitive credentials are kept in `.env` and excluded via `.gitignore`

---

## 📌 Future Enhancements

- Support for analyzing entire repositories (not just single files)
- Multi-model support (switching between different AI providers per agent)
- Downloadable PDF reports of analysis results

---

## 👩‍💻 Author

Built by [Nilya575](https://github.com/Nilya575)
