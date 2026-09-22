import json
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from laya_engine import LayaEngine

app = FastAPI(title="LayaQuiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("questions.json") as f:
    QUESTIONS = json.load(f)

laya_engine = LayaEngine()


class DecisionRequest(BaseModel):
    state: str
    options: List[str]


class AnswerRequest(BaseModel):
    question_id: str
    selected_index: int
    time_taken: float
    streak: int


@app.get("/api/questions")
def get_all_questions():
    return QUESTIONS


@app.post("/api/decide")
def make_decision(req: DecisionRequest):
    return laya_engine.get_decision(req.state, req.options)


@app.post("/api/answer")
def submit_answer(req: AnswerRequest):
    q = next((q for q in QUESTIONS if q["id"] == req.question_id), None)
    if not q:
        return {"error": "Question not found"}

    correct = req.selected_index == q["correctIndex"]
    base = {"easy": 100, "medium": 200, "hard": 300}[q["difficulty"]]
    speed_bonus = max(0, int((15 - req.time_taken) * 10))
    new_streak = req.streak + 1 if correct else 0
    multiplier = min(new_streak, 5)
    points = (base + speed_bonus) * max(multiplier, 1) if correct else 0

    return {
        "correct": correct,
        "correctIndex": q["correctIndex"],
        "explanation": q["explanation"],
        "points": points,
        "new_streak": new_streak,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
