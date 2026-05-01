from logic.knowledge_base import KnowledgeBase
from logic.wumpus_rule import (
    tell_breeze_percept,
    tell_stench_percept,
    is_cell_safe
)


class Agent:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.kb = KnowledgeBase()
        self.visited = set()
        self.safe_cells = set()
        self.unsafe_cells = set()
        self.current_pos = (0, 0)
        self.total_inference_steps = 0
        self.move_history = []

        # Start cell safe hai hamesha
        self.visited.add((0, 0))
        self.safe_cells.add((0, 0))

    def process_percepts(self, row, col, percepts):
        """
        Percepts receive karo aur KB ko update karo

        percepts = {
            "breeze": True/False,
            "stench": True/False,
            "glitter": True/False
        }
        """
        # Breeze KB mein daalo
        tell_breeze_percept(
            self.kb, row, col,
            percepts["breeze"],
            self.rows, self.cols
        )

        # Stench KB mein daalo
        tell_stench_percept(
            self.kb, row, col,
            percepts["stench"],
            self.rows, self.cols
        )

        # Current position visited mark karo
        self.visited.add((row, col))
        self.current_pos = (row, col)

        # Adjacent cells check karo
        self.update_safe_cells(row, col)

    def update_safe_cells(self, row, col):
        """
        Current cell ke adjacent cells ko
        Resolution se check karo safe hain ya nahi
        """
        adjacent = self.get_adjacent(row, col)

        for ar, ac in adjacent:
            if (ar, ac) not in self.visited:
                result = is_cell_safe(self.kb, ar, ac)
                self.total_inference_steps += result["inference_steps"]

                if result["safe"]:
                    self.safe_cells.add((ar, ac))
                elif not result["no_pit"] or not result["no_wumpus"]:
                    self.unsafe_cells.add((ar, ac))

    def get_next_move(self):
        """
        Agent ka next move decide karo

        Priority:
        1. Safe unvisited cell → Jao
        2. Koi safe cell nahi → Random unvisited (risk lo)
        3. Kuch nahi → Wapas (0,0) pe jao
        """
        # Safe unvisited cells nikalo
        safe_unvisited = [
            cell for cell in self.safe_cells
            if cell not in self.visited
        ]

        if safe_unvisited:
            # Sabse pehli safe cell choose karo
            next_cell = safe_unvisited[0]
            return {
                "row": next_cell[0],
                "col": next_cell[1],
                "reason": "Safe cell found by Resolution ✅",
                "is_safe": True
            }

        # Koi safe cell nahi - adjacent unvisited check karo
        adjacent = self.get_adjacent(
            self.current_pos[0],
            self.current_pos[1]
        )
        unknown_cells = [
            cell for cell in adjacent
            if cell not in self.visited
            and cell not in self.unsafe_cells
        ]

        if unknown_cells:
            next_cell = unknown_cells[0]
            return {
                "row": next_cell[0],
                "col": next_cell[1],
                "reason": "Unknown cell - Risk le raha hun ⚠️",
                "is_safe": False
            }

        # Wapas start pe jao
        return {
            "row": 0,
            "col": 0,
            "reason": "Koi option nahi - Wapas start pe ↩️",
            "is_safe": True
        }

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

    def get_cell_status(self, row, col):
        """
        Kisi cell ka status return karo
        Frontend ke liye
        """
        if (row, col) == self.current_pos:
            return "agent"
        elif (row, col) in self.visited:
            return "visited"
        elif (row, col) in self.safe_cells:
            return "safe"
        elif (row, col) in self.unsafe_cells:
            return "unsafe"
        else:
            return "unknown"

    def get_kb_stats(self):
        """KB ki statistics return karo"""
        return {
            "total_clauses": len(self.kb.get_all_clauses()),
            "visited_cells": len(self.visited),
            "safe_cells": len(self.safe_cells),
            "unsafe_cells": len(self.unsafe_cells),
            "total_inference_steps": self.total_inference_steps
        }

    def reset(self, rows=None, cols=None):
        """Agent reset karo"""
        if rows:
            self.rows = rows
        if cols:
            self.cols = cols
        self.kb.reset()
        self.visited = set()
        self.safe_cells = set()
        self.unsafe_cells = set()
        self.current_pos = (0, 0)
        self.total_inference_steps = 0
        self.move_history = []
        self.visited.add((0, 0))
        self.safe_cells.add((0, 0))