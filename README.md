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