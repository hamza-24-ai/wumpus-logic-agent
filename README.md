# 🤖 Wumpus Logic Agent

A Web-based Knowledge-Based Agent that navigates 
the Wumpus World using Propositional Logic and 
Resolution Refutation Algorithm.

Built as part of AI 2002 - Artificial Intelligence
course at National University of Computer & 
Emerging Sciences.

---

## 🌐 Live Demo

🔗 [Wumpus Logic Agent](https://wumpus-logic-agent-phi.vercel.app/)

---

## 🧠 What is this?

The agent navigates a grid-based Wumpus World.
It does NOT move randomly — it THINKS before 
moving using real AI inference to prove which 
cells are safe.

---

## ⚙️ Tech Stack

### Backend
- Python 3.11
- FastAPI
- Uvicorn
- Pydantic

### Frontend
- React + Vite
- Tailwind CSS
- Context API

---

## 🔬 Core AI Concepts

### Knowledge Base
- TELL → Add new rules to KB
- ASK  → Query KB using Resolution

### CNF Conversion (3 Steps)
1. Eliminate Biconditionals (⇔)
2. Eliminate Implications (⇒)
3. Push Negations inward (De Morgan)
4. Distribute OR over AND

### Resolution Refutation
- Negate the query
- Add to KB clauses
- Resolve until contradiction found
- Empty clause = PROVED ✅

### Optimizations
- Unit Propagation
- Pure Literal Elimination
- Known cells skip (no redundant inference)

---

## 🎮 Features

- ✅ Dynamic grid sizing (2×2 to 10×10)
- ✅ Random hazard placement
- ✅ Real-time KB statistics
- ✅ Auto-move using AI inference
- ✅ Manual cell click movement
- ✅ Dark / Light theme
- ✅ Mobile responsive
- ✅ Inference step counter
- ✅ Active percepts display

---

## 🗺️ How Agent Works

Agent starts at (0,0)
Receives percepts (Breeze/Stench)
TELL KB new rules
ASK KB: "Is adjacent cell safe?"
Resolution Engine proves safety
Move to safe cell ✅
Repeat until Gold found 🏆


---

## 🎯 Cell Types

| Cell | Meaning |
|------|---------|
| 🤖 | Agent current position |
| ✅ | Proven safe cell |
| ❓ | Unknown cell |
| 👹 | Wumpus location |
| 🕳️ | Pit location |
| 🏆 | Gold location |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/new-game | Start new game |
| POST | /api/move | Move agent manually |
| GET | /api/auto-move | Agent auto decides |
| GET | /api/kb-status | KB statistics |

---

## 🚀 Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn python-multipart
python -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variable
```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
```

---

## 📊 Percepts

| Percept | Meaning |
|---------|---------|
| 💨 Breeze | Pit in adjacent cell |
| 🦨 Stench | Wumpus in adjacent cell |
| ✨ Glitter | Gold in current cell |

---

## 👨‍💻 Developer

**Hamza**
FAST - National University of Computer
& Emerging Sciences
AI 2002 - Artificial Intelligence
Spring 2026
