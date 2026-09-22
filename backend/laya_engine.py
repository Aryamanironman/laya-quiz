from laya import Laya
from typing import List, Dict, Any


class LayaEngine:
    """Wrapper around Laya for quiz decision-making."""

    def __init__(self):
        self.model = Laya("convaiinnovations/laya-typed-decisions")

    def get_decision(self, state: str, options: List[str]) -> Dict[str, Any]:
        result = self.model.choice(state, options)
        return {"selected": result.selected, "scores": result.scores}
