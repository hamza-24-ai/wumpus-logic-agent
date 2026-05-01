from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from agent.environment import Environment
from agent.agent import Agent

app = FastAPI(title="Wumpus Logic Agent API")

# CORS - React frontend se connect karne ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wumpus-logic-agent-cxth.vercel.app/"],  # Baad mein Vercel URL daalna
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Game State
environment: Optional[Environment] = None
agent: Optional[Agent] = None


# ─── Request Models ───────────────────────────────────────

class NewGameRequest(BaseModel):
    rows: int = 4
    cols: int = 4

class MoveRequest(BaseModel):
    row: int
    col: int


# ─── API Endpoints ────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Wumpus Logic Agent API is running! 🚀"}


@app.post("/api/new-game")
def new_game(request: NewGameRequest):
    """
    Naya game start karo
    Grid banao, hazards place karo
    Agent initialize karo
    """
    global environment, agent

    # Validation
    if request.rows < 2 or request.cols < 2:
        return {"error": "Grid kam az kam 2x2 honi chahiye!"}
    if request.rows > 10 or request.cols > 10:
        return {"error": "Grid zyada se zyada 10x10 ho sakti hai!"}

    # Environment aur Agent banao
    environment = Environment(request.rows, request.cols)
    environment.place_hazards()
    agent = Agent(request.rows, request.cols)

    # Start cell ke percepts lo
    percepts = environment.get_percepts(0, 0)
    agent.process_percepts(0, 0, percepts)

    return {
        "success": True,
        "message": "Naya game shuru ho gaya! 🎮",
        "rows": request.rows,
        "cols": request.cols,
        "grid": environment.get_grid_state(reveal=False),
        "agent_pos": {"row": 0, "col": 0},
        "percepts": percepts,
        "kb_stats": agent.get_kb_stats()
    }


@app.post("/api/move")
def move_agent(request: MoveRequest):
    """
    Agent ko manually move karo
    """
    global environment, agent

    if not environment or not agent:
        return {"error": "Pehle new game start karo!"}

    if not environment.agent_alive:
        return {"error": "Agent mar chuka hai! New game start karo!"}

    # Move karo
    result = environment.move_agent(request.row, request.col)

    if not result["success"]:
        return {"error": result["message"]}

    # Percepts lo aur KB update karo
    if environment.agent_alive:
        percepts = environment.get_percepts(request.row, request.col)
        agent.process_percepts(request.row, request.col, percepts)
    else:
        percepts = {}

    # Game over check
    reveal = not environment.agent_alive

    return {
        "success": True,
        "message": result["message"],
        "alive": environment.agent_alive,
        "gold_found": result["gold_found"],
        "agent_pos": {"row": request.row, "col": request.col},
        "percepts": percepts,
        "grid": environment.get_grid_state(reveal=reveal),
        "kb_stats": agent.get_kb_stats(),
        "cell_statuses": get_all_cell_statuses()
    }


@app.get("/api/auto-move")
def auto_move():
    """
    Agent khud next move decide kare
    Resolution Engine use karega
    """
    global environment, agent

    if not environment or not agent:
        return {"error": "Pehle new game start karo!"}

    if not environment.agent_alive:
        return {"error": "Agent mar chuka hai! New game start karo!"}

    # Agent ka next move
    next_move = agent.get_next_move()
    row, col = next_move["row"], next_move["col"]

    # Move execute karo
    result = environment.move_agent(row, col)

    if environment.agent_alive:
        percepts = environment.get_percepts(row, col)
        agent.process_percepts(row, col, percepts)
    else:
        percepts = {}

    reveal = not environment.agent_alive

    return {
        "success": True,
        "message": result["message"],
        "move_reason": next_move["reason"],
        "is_safe_move": next_move["is_safe"],
        "alive": environment.agent_alive,
        "gold_found": result["gold_found"],
        "agent_pos": {"row": row, "col": col},
        "percepts": percepts,
        "grid": environment.get_grid_state(reveal=reveal),
        "kb_stats": agent.get_kb_stats(),
        "cell_statuses": get_all_cell_statuses()
    }


@app.get("/api/kb-status")
def kb_status():
    """KB ki current state return karo"""
    if not agent:
        return {"error": "Pehle new game start karo!"}

    return {
        "stats": agent.get_kb_stats(),
        "clauses": [
            list(clause) for clause in agent.kb.get_all_clauses()
        ]
    }


@app.post("/api/ask")
def ask_kb(row: int, col: int):
    """
    Manually kisi cell ke baare mein KB se poochho
    """
    if not agent:
        return {"error": "Pehle new game start karo!"}

    result = is_cell_safe_api(row, col)
    return result


# ─── Helper Functions ─────────────────────────────────────

def get_all_cell_statuses():
    """Saari cells ka status return karo"""
    if not agent or not environment:
        return {}

    statuses = {}
    for r in range(environment.rows):
        for c in range(environment.cols):
            statuses[f"{r}_{c}"] = agent.get_cell_status(r, c)
    return statuses


def is_cell_safe_api(row, col):
    """Cell safe hai ya nahi check karo"""
    from logic.wumpus_rule import is_cell_safe
    result = is_cell_safe(agent.kb, row, col)
    agent.total_inference_steps += result["inference_steps"]
    return {
        "row": row,
        "col": col,
        "safe": result["safe"],
        "no_pit": result["no_pit"],
        "no_wumpus": result["no_wumpus"],
        "inference_steps": result["inference_steps"]
    }


# ─── Run Server ───────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)