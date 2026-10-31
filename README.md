# EzOrb Package Manager

The official package registry for EzOrb Linux — the AI-native operating system. Discover, install, and publish signed packages (system tools, networking, AI agents, and developer tooling). Built with React (Vite), FastAPI, and MongoDB.

## 🚀 Features
- Browse and search packages with category filters and sorting.
- Detailed package views with README, version history, and dependencies.
- User authentication (Register, Login, Logout) with secure httpOnly cookies.
- Light and Dark mode support.
- Modern glassmorphism UI with brushed-metal textures.

---

## 🛠️ Prerequisites

Make sure you have these installed on your machine:
1. **Node.js** (v18+) & **npm**
2. **Python** (v3.10+)
3. **MongoDB Community Server**
4. **Git**

### Installation Guide by OS:

**🪟 Windows:**
- **Node.js**: Download the `.msi` installer from [nodejs.org](https://nodejs.org/).
- **Python**: Download from [python.org](https://www.python.org/downloads/). **(IMPORTANT: Check "Add python.exe to PATH" during installation)**.
- **MongoDB**: Download the `.msi` from [mongodb.com](https://www.mongodb.com/try/download/community). Ensure **"Install MongoD as a Service"** is checked.
- **Git**: Download from [git-scm.com](https://git-scm.com/download/win).

**🍎 macOS (using Homebrew):**
```bash
brew install node python mongodb-community git
brew services start mongodb-community

🐧 Linux (Ubuntu/Debian):
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python & Git
sudo apt-get install python3 python3-pip python3-venv git

# MongoDB (Follow official docs for your specific distro)

⚙️ How to Run Locally
Open your terminal and follow these steps:

1. Clone the Repository
bash
git clone https://github.com/ALAZZA15/ezorb-pm.git
cd ezorb-pm
2. Setup Backend
Open a new terminal and go to the backend folder:

bash
cd backend
Windows:

powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
macOS / Linux:

bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
Create a .env file inside the backend folder:

env
MONGO_URL=mongodb://localhost:27017
DB_NAME=ezorb_db
Seed the Database & Run Server:

bash
python seed.py
uvicorn server:app --reload --port 8001
(Leave this terminal running).

3. Setup Frontend
Open a new terminal (don't close the backend one), then:

bash
cd frontend
npm install --legacy-peer-deps
npm run dev
4. Open in Browser
Go to: 👉 http://localhost:5173/

🔐 Demo Account
If you ran python seed.py, you can log in with:

Email: demo@ezorb.dev

Password: OrbDemo2026!

Built for the EzOrb Linux community.

text

4. Simpan file (**Ctrl + S**).

---

### 🚀 Upload README ke GitHub

Setelah file `README.md` tersimpan, buka terminal VS Code dan jalankan:

```powershell
git add .
git commit -m "Docs: add README with installation guide"
git push