

def resolution_refutation(kb_clauses, query):
    from logic.cnf_converter import to_cnf, extract_clauses

    MAX_STEPS = 500

    negated_query = ('NOT', query)
    negated_cnf = to_cnf(negated_query)
    negated_clauses = extract_clauses(negated_cnf)

    # Working set banao
    clauses = set()
    for c in kb_clauses:
        clauses.add(frozenset(c))
    for c in negated_clauses:
        clauses.add(frozenset(c))

    inference_steps = 0

    # Step 1: Unit Propagation pehle karo
    # Single literal clauses se seedha prove karo
    result = unit_propagation(clauses)
    if result == "CONTRADICTION":
        return {
            "proved": True,
            "inference_steps": 1,
            "message": "Unit Propagation se Proved ✅"
        }
    if result is not None:
        clauses = result

    # Step 2: Pure Literal Elimination
    clauses = pure_literal_elimination(clauses)

    # Step 3: Resolution
    while True:
        new_clauses = set()

        clause_list = list(clauses)

        for i in range(len(clause_list)):
            for j in range(i + 1, len(clause_list)):

                if inference_steps >= MAX_STEPS:
                    return {
                        "proved": False,
                        "inference_steps": inference_steps,
                        "message": "Timeout ❌"
                    }

                resolvent = resolve(clause_list[i], clause_list[j])
                inference_steps += 1

                # Empty clause = contradiction = PROVED
                if resolvent == frozenset():
                    return {
                        "proved": True,
                        "inference_steps": inference_steps,
                        "message": "Proved ✅"
                    }

                if resolvent is not None:
                    new_clauses.add(resolvent)

        # Koi naya clause nahi = unprovable
        if new_clauses.issubset(clauses):
            return {
                "proved": False,
                "inference_steps": inference_steps,
                "message": "Unprovable ❌"
            }

        clauses = clauses.union(new_clauses)


def unit_propagation(clauses):
    """
    Single literal clauses se seedha simplify karo

    Example:
    {P} aur {NOT P, Q} hai
    → P = True
    → {Q} reh jaata hai
    → Bohot fast!
    """
    clauses = set(clauses)
    changed = True

    while changed:
        changed = False
        # Unit clauses nikalo (sirf ek literal wale)
        unit_clauses = {
            next(iter(c)) for c in clauses
            if len(c) == 1
        }

        if not unit_clauses:
            break

        for unit in unit_clauses:
            complement = get_complement(unit)
            new_clauses = set()

            for clause in clauses:
                # Unit se satisfy hone wali clauses hata do
                if unit in clause:
                    continue
                # Complement hata ke clause simplify karo
                if complement in clause:
                    simplified = clause - {complement}
                    # Empty clause = contradiction!
                    if len(simplified) == 0:
                        return "CONTRADICTION"
                    new_clauses.add(simplified)
                else:
                    new_clauses.add(clause)

            if new_clauses != clauses:
                clauses = new_clauses
                changed = True

    return clauses


def pure_literal_elimination(clauses):

    all_literals = set()
    for clause in clauses:
        all_literals.update(clause)

    pure_literals = set()
    for lit in all_literals:
        complement = get_complement(lit)
        # Agar complement nahi hai to pure hai
        if complement not in all_literals:
            pure_literals.add(lit)

    if not pure_literals:
        return clauses

    # Pure literals wali clauses hata do
    new_clauses = set()
    for clause in clauses:
        if not any(lit in clause for lit in pure_literals):
            new_clauses.add(clause)

    return new_clauses


def resolve(clause1, clause2):
    """Do clauses resolve karo"""
    for literal in clause1:
        complement = get_complement(literal)
        if complement in clause2:
            new_clause = (clause1 - {literal}) | (clause2 - {complement})
            return frozenset(new_clause)
    return None


def get_complement(literal):
    """Literal ka complement nikalo"""
    if isinstance(literal, tuple) and literal[0] == 'NOT':
        return literal[1]
    else:
        return ('NOT', literal)