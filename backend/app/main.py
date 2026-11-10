import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api import health, food, meals, chat, users, feedback, grocery, analytics, nutritionist

settings = get_settings()

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger("nutrimind")

app = FastAPI(
    title="NutriMind AI API",
    description="AI-powered nutrition intelligence backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(food.router)
app.include_router(meals.router)
app.include_router(chat.router)
app.include_router(users.router)
app.include_router(feedback.router)
app.include_router(grocery.router)
app.include_router(analytics.router)
app.include_router(nutritionist.router)


@app.on_event("startup")
async def startup():
    logger.info("NutriMind AI API started [%s]", settings.app_env)
