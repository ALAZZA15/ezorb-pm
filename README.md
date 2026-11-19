# EzOrb Package Manager

The official package registry for EzOrb Linux — the AI-native operating system. Discover, install, and publish signed packages built with React (Vite), FastAPI, and MongoDB.

## 🛠️ Prerequisites

Make sure you have these installed:
1. **Node.js** (v18+) & **npm**
2. **Python** (v3.10+)
3. **MongoDB Community Server**
4. **Git**

### Installation Guide by OS

**🪟 Windows:**
- **Node.js**: [Download .msi installer](https://nodejs.org/)
- **Python**: [Download from python.org](https://www.python.org/downloads/) **(IMPORTANT: Check "Add python.exe to PATH")**
- **MongoDB**: [Download .msi](https://www.mongodb.com/try/download/community) **(Check "Install MongoD as a Service")**
- **Git**: [Download Git for Windows](https://git-scm.com/download/win)

**🍎 macOS (using Homebrew):**
```bash
brew install node python mongodb-community git
brew services start mongodb-community
```

**🐧 Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install python3 python3-pip python3-venv git
```

---

## ⚙️ How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/ALAZZA15/ezorb-pm.git
cd ezorb-pm
```

### 2. Setup Backend
Go to the backend folder:
```bash
cd backend
```

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Create a `.env` file** inside the `backend` folder:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=ezorb_db
```

**Seed the Database & Run Server:**
```bash
python seed.py
uvicorn server:app --reload --port 8001
```

### 3. Setup Frontend
Open a **new terminal**, then:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### 4. Open in Browser
Go to: 👉 **http://localhost:5173/**

---

## 🔐 Demo Account
If you ran `python seed.py`, you can log in with:
- **Email:** `demo@ezorb.dev`
- **Password:** `OrbDemo2026!`

---

## 🚀 Deploy to Vercel

The frontend and FastAPI backend should be deployed as **two Vercel projects**. MongoDB must be hosted separately (for example, MongoDB Atlas); Vercel does not run the local MongoDB service.

### 1. Deploy the API

1. Import this repository into Vercel and set **Root Directory** to `backend`.
2. Deploy it as a FastAPI project. Vercel detects `server.py` and installs dependencies from `requirements.txt`.
3. Add these environment variables to the API project for Production:
   - `MONGO_URL`: your MongoDB Atlas connection string
   - `DB_NAME`: your database name (for example, `ezorb_db`)
   - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: optional, if enabling GitHub OAuth
4. Deploy the API.

### 2. Deploy the frontend

1. Create a second Vercel project from the same repository and set **Root Directory** to `frontend`.
2. Use the Vite defaults (`npm run build`, output directory `dist`).
3. After the API project is deployed, replace `YOUR-API-PROJECT` in `frontend/vercel.json` with the API project's Vercel hostname (without `https://`), then redeploy the frontend.
4. Set the frontend's Production URL as `APP_URL` in the API project, then redeploy the API. If enabling GitHub OAuth, set its callback URL to `<APP_URL>/api/auth/github/callback`.

The frontend configuration proxies `/api/*` to the backend and routes browser URLs to the SPA entry point. This keeps API requests and the secure session cookie on the frontend's origin.