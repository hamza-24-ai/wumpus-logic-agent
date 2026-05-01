class KnowledgeBase:
    def __init__(self):
        self.clauses = []  # CNF clauses store hongi yahan

    def tell(self, clause):
        """KB mein naya rule add karo"""
        if clause not in self.clauses:
            self.clauses.append(clause)

    def ask(self, query):
        """KB se query karo - Resolution use karega"""
        from logic.resolution import resolution_refutation
        return resolution_refutation(self.clauses, query)

    def reset(self):
        """Game reset pe KB clear karo"""
        self.clauses = []

    def get_all_clauses(self):
        """Saari clauses return karo"""
        return self.clauses