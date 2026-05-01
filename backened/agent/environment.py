import random


class Environment:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.grid = {}        # Har cell ki info
        self.wumpus_pos = None
        self.gold_pos = None
        self.pit_positions = set()
        self.agent_pos = (0, 0)  # Start position
        self.agent_alive = True
        self.gold_found = False
        self.setup_grid()

    def setup_grid(self):
        """
        Grid initialize karo
        Har cell ka default state
        """
        for r in range(self.rows):
            for c in range(self.cols):
                self.grid[(r, c)] = {
                    "has_pit": False,
                    "has_wumpus": False,
                    "has_gold": False,
                    "has_breeze": False,
                    "has_stench": False,
                    "visited": False,
                    "safe": False
                }

        # Start cell hamesha safe hoti hai
        self.grid[(0, 0)]["visited"] = True
        self.grid[(0, 0)]["safe"] = True

    def place_hazards(self):
        """
        Randomly Pits aur Wumpus place karo
        Rules:
        - Start cell (0,0) pe kuch nahi
        - Wumpus sirf ek hoga
        - Pits randomly multiple ho sakte hain
        """
        all_cells = [
            (r, c)
            for r in range(self.rows)
            for c in range(self.cols)
            if (r, c) != (0, 0)  # Start cell chhodo
        ]

        # Wumpus place karo
        self.wumpus_pos = random.choice(all_cells)
        self.grid[self.wumpus_pos]["has_wumpus"] = True
        remaining = [c for c in all_cells if c != self.wumpus_pos]

        # Gold place karo
        self.gold_pos = random.choice(remaining)
        self.grid[self.gold_pos]["has_gold"] = True
        remaining = [c for c in remaining if c != self.gold_pos]

        # Pits place karo - 20% chance har cell ko
        for cell in remaining:
            if random.random() < 0.2:
                self.pit_positions.add(cell)
                self.grid[cell]["has_pit"] = True

        # Breeze aur Stench calculate karo
        self.calculate_percepts()

    def calculate_percepts(self):
        """
        Har cell ke liye Breeze aur Stench calculate karo
        
        Breeze  → Adjacent cell mein Pit hai
        Stench  → Adjacent cell mein Wumpus hai
        """
        for r in range(self.rows):
            for c in range(self.cols):
                adjacent = self.get_adjacent(r, c)

                # Breeze check
                for ar, ac in adjacent:
                    if self.grid[(ar, ac)]["has_pit"]:
                        self.grid[(r, c)]["has_breeze"] = True
                        break

                # Stench check
                for ar, ac in adjacent:
                    if self.grid[(ar, ac)]["has_wumpus"]:
                        self.grid[(r, c)]["has_stench"] = True
                        break

    def get_adjacent(self, row, col):
        """Adjacent cells return karo"""
        adjacent = []
        if row > 0:
            adjacent.append((row - 1, col))
        if row < self.rows - 1:
            adjacent.append((row + 1, col))
        if col > 0:
            adjacent.append((row, col - 1))
        if col < self.cols - 1:
            adjacent.append((row, col + 1))
        return adjacent

    def get_percepts(self, row, col):
        """
        Agent ki current position ke percepts return karo
        """
        cell = self.grid[(row, col)]
        return {
            "breeze": cell["has_breeze"],
            "stench": cell["has_stench"],
            "glitter": cell["has_gold"],
            "bump": False,
            "scream": False
        }

    def move_agent(self, new_row, new_col):
        """
        Agent ko move karo
        Return karo result
        """
        # Boundary check
        if not (0 <= new_row < self.rows and 0 <= new_col < self.cols):
            return {
                "success": False,
                "message": "Boundary se bahar nahi ja sakte!",
                "alive": True,
                "gold_found": False
            }

        self.agent_pos = (new_row, new_col)
        cell = self.grid[(new_row, new_col)]
        cell["visited"] = True

        # Pit mein gira?
        if cell["has_pit"]:
            self.agent_alive = False
            return {
                "success": True,
                "message": " Agent Pit mein gir gaya! Game Over!",
                "alive": False,
                "gold_found": False
            }

        # Wumpus se mila?
        if cell["has_wumpus"]:
            self.agent_alive = False
            return {
                "success": True,
                "message": " Wumpus ne kha liya! Game Over!",
                "alive": False,
                "gold_found": False
            }

        # Gold mila?
        if cell["has_gold"] and not self.gold_found:
            self.gold_found = True
            return {
                "success": True,
                "message": " Gold Mil Gaya! Wapas jao!",
                "alive": True,
                "gold_found": True
            }

        return {
            "success": True,
            "message": f" Agent moved to ({new_row}, {new_col})",
            "alive": True,
            "gold_found": False
        }

    def get_grid_state(self, reveal=False):
        """
        Frontend ke liye grid state return karo
        reveal=False → Agent ko sirf visited cells dikhao
        reveal=True  → Sab kuch dikhao (Game Over pe)
        """
        state = []
        for r in range(self.rows):
            row_data = []
            for c in range(self.cols):
                cell = self.grid[(r, c)]
                if reveal or cell["visited"]:
                    row_data.append({
                        "row": r,
                        "col": c,
                        "visited": cell["visited"],
                        "safe": cell["safe"],
                        "has_pit": cell["has_pit"] if reveal else False,
                        "has_wumpus": cell["has_wumpus"] if reveal else False,
                        "has_gold": cell["has_gold"],
                        "has_breeze": cell["has_breeze"],
                        "has_stench": cell["has_stench"],
                        "is_agent": self.agent_pos == (r, c)
                    })
                else:
                    row_data.append({
                        "row": r,
                        "col": c,
                        "visited": False,
                        "safe": cell["safe"],
                        "has_pit": False,
                        "has_wumpus": False,
                        "has_gold": False,
                        "has_breeze": False,
                        "has_stench": False,
                        "is_agent": False
                    })
            state.append(row_data)
        return state

    def reset(self, rows=None, cols=None):
        """Game reset karo"""
        if rows:
            self.rows = rows
        if cols:
            self.cols = cols
        self.grid = {}
        self.wumpus_pos = None
        self.gold_pos = None
        self.pit_positions = set()
        self.agent_pos = (0, 0)
        self.agent_alive = True
        self.gold_found = False
        self.setup_grid()
        self.place_hazards()