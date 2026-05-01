def to_cnf(formula):
    """
    Formula ko CNF mein convert karo
    Steps:
    1. Biconditional eliminate karo
    2. Implication eliminate karo  
    3. Negation andar push karo (De Morgan)
    4. Distribution karo (AND over OR)
    """
    formula = eliminate_biconditional(formula)
    formula = eliminate_implication(formula)
    formula = push_negation(formula)
    formula = distribute(formula)
    return formula


def eliminate_biconditional(f):
    """A ⇔ B  →  (A ⇒ B) ∧ (B ⇒ A)"""
    if not isinstance(f, tuple):
        return f
    if f[0] == 'BICONDITIONAL':
        A = eliminate_biconditional(f[1])
        B = eliminate_biconditional(f[2])
        return ('AND',
                ('IMPLIES', A, B),
                ('IMPLIES', B, A))
    return tuple(eliminate_biconditional(x) for x in f)


def eliminate_implication(f):
    """A ⇒ B  →  ¬A ∨ B"""
    if not isinstance(f, tuple):
        return f
    if f[0] == 'IMPLIES':
        A = eliminate_implication(f[1])
        B = eliminate_implication(f[2])
        return ('OR', ('NOT', A), B)
    return tuple(eliminate_implication(x) for x in f)


def push_negation(f):
    """De Morgan laws apply karo"""
    if not isinstance(f, tuple):
        return f
    # Double negation
    if f[0] == 'NOT' and isinstance(f[1], tuple) and f[1][0] == 'NOT':
        return push_negation(f[1][1])
    # NOT (A AND B) → (NOT A) OR (NOT B)
    if f[0] == 'NOT' and isinstance(f[1], tuple) and f[1][0] == 'AND':
        return ('OR',
                push_negation(('NOT', f[1][1])),
                push_negation(('NOT', f[1][2])))
    # NOT (A OR B) → (NOT A) AND (NOT B)
    if f[0] == 'NOT' and isinstance(f[1], tuple) and f[1][0] == 'OR':
        return ('AND',
                push_negation(('NOT', f[1][1])),
                push_negation(('NOT', f[1][2])))
    return tuple(push_negation(x) for x in f)


def distribute(f):
    """OR ko AND ke upar distribute karo"""
    if not isinstance(f, tuple):
        return f
    if f[0] == 'OR':
        A = distribute(f[1])
        B = distribute(f[2])
        # (A AND B) OR C → (A OR C) AND (B OR C)
        if isinstance(A, tuple) and A[0] == 'AND':
            return ('AND',
                    distribute(('OR', A[1], B)),
                    distribute(('OR', A[2], B)))
        if isinstance(B, tuple) and B[0] == 'AND':
            return ('AND',
                    distribute(('OR', A, B[1])),
                    distribute(('OR', A, B[2])))
        return ('OR', A, B)
    return tuple(distribute(x) for x in f)


def extract_clauses(cnf):
    """CNF ko flat clause list mein convert karo"""
    if not isinstance(cnf, tuple):
        return [frozenset([cnf])]
    if cnf[0] == 'AND':
        return extract_clauses(cnf[1]) + extract_clauses(cnf[2])
    if cnf[0] == 'OR':
        literals = set()
        collect_literals(cnf, literals)
        return [frozenset(literals)]
    if cnf[0] == 'NOT':
        return [frozenset([cnf])]
    return [frozenset([cnf])]


def collect_literals(f, result):
    """OR clause se saare literals nikalo"""
    if not isinstance(f, tuple):
        result.add(f)
        return
    if f[0] == 'OR':
        collect_literals(f[1], result)
        collect_literals(f[2], result)
    elif f[0] == 'NOT':
        result.add(f)
    else:
        result.add(f)