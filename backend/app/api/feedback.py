from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.agents.feedback_agent import process_feedback

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


class FeedbackRequest(BaseModel):
    feedback_text: str
    target_type: str = "meal"
    target_id: str | None = None


@router.post("/")
async def submit_feedback(req: FeedbackRequest, user=Depends(get_current_user)):
    result = await process_feedback(user["id"], req.feedback_text, req.target_type, req.target_id)
    return result
