def get_adjacent_cells(row, col, max_rows, max_cols):
    """
    Kisi bhi cell ke adjacent cells nikalo
    
    Example: Cell (2,2) ke adjacent:
    → (1,2), (3,2), (2,1), (2,3)
    """
    adjacent = []
    if row > 0:
        adjacent.append((row - 1, col))   # Upar
    if row < max_rows - 1:
        adjacent.append((row + 1, col))   # Neeche
    if col > 0:
        adjacent.append((row, col - 1))   # Baayein
    if col < max_cols - 1:
        adjacent.append((row, col + 1))   # Daayein
    return adjacent


def generate_breeze_rule(row, col, max_rows, max_cols):
    """
    Breeze rule generate karo kisi cell ke liye
    
    B_r,c ⇔ (P_r1,c1 ∨ P_r2,c2 ∨ ...)
    
    Example: B_1,1 ⇔ (P_0,1 ∨ P_2,1 ∨ P_1,0 ∨ P_1,2)
    """
    adjacent = get_adjacent_cells(row, col, max_rows, max_cols)
    breeze_atom = f"B_{row}_{col}"

    # Adjacent cells ki OR chain banao
    pit_literals = [f"P_{r}_{c}" for r, c in adjacent]

    if not pit_literals:
        return None

    # OR chain banao
    or_chain = pit_literals[0]
    for lit in pit_literals[1:]:
        or_chain = ('OR', or_chain, lit)

    # Biconditional return karo
    return ('BICONDITIONAL', breeze_atom, or_chain)


def generate_stench_rule(row, col, max_rows, max_cols):
    """
    Stench rule generate karo kisi cell ke liye
    
    S_r,c ⇔ (W_r1,c1 ∨ W_r2,c2 ∨ ...)
    """
    adjacent = get_adjacent_cells(row, col, max_rows, max_cols)
    stench_atom = f"S_{row}_{col}"

    wumpus_literals = [f"W_{r}_{c}" for r, c in adjacent]

    if not wumpus_literals:
        return None

    or_chain = wumpus_literals[0]
    for lit in wumpus_literals[1:]:
        or_chain = ('OR', or_chain, lit)

    return ('BICONDITIONAL', stench_atom, or_chain)


def tell_breeze_percept(kb, row, col, has_breeze, max_rows, max_cols):
    """
    Agent ko breeze mila ya nahi - KB ko batao
    
    Breeze mila    → B_r,c = True  tell karo
    Breeze nahi    → ¬B_r,c = True tell karo
    """
    from logic.cnf_converter import to_cnf, extract_clauses

    # Breeze rule KB mein daalo
    rule = generate_breeze_rule(row, col, max_rows, max_cols)
    if rule:
        cnf = to_cnf(rule)
        clauses = extract_clauses(cnf)
        for clause in clauses:
            kb.tell(clause)

    # Percept KB mein daalo
    breeze_atom = f"B_{row}_{col}"
    if has_breeze:
        kb.tell(frozenset([breeze_atom]))        # B_r,c
    else:
        kb.tell(frozenset([('NOT', breeze_atom)]))  # ¬B_r,c


def tell_stench_percept(kb, row, col, has_stench, max_rows, max_cols):
    """
    Agent ko stench mila ya nahi - KB ko batao
    """
    from logic.cnf_converter import to_cnf, extract_clauses

    rule = generate_stench_rule(row, col, max_rows, max_cols)
    if rule:
        cnf = to_cnf(rule)
        clauses = extract_clauses(cnf)
        for clause in clauses:
            kb.tell(clause)

    stench_atom = f"S_{row}_{col}"
    if has_stench:
        kb.tell(frozenset([stench_atom]))
    else:
        kb.tell(frozenset([('NOT', stench_atom)]))


def is_cell_safe(kb, row, col):
    """
    Resolution se prove karo ke cell safe hai
    
    Safe = No Pit AND No Wumpus
    """
    pit_query = ('NOT', f"P_{row}_{col}")
    wumpus_query = ('NOT', f"W_{row}_{col}")

    pit_result = kb.ask(pit_query)
    wumpus_result = kb.ask(wumpus_query)

    return {
        "safe": pit_result["proved"] and wumpus_result["proved"],
        "no_pit": pit_result["proved"],
        "no_wumpus": wumpus_result["proved"],
        "inference_steps": pit_result["inference_steps"] + wumpus_result["inference_steps"]
    }