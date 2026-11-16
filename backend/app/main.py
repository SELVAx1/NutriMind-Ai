import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

settings = get_settings()

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger("nutrimind")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("NutriMind AI API started [%s]", settings.app_env)
    yield


app = FastAPI(
    title="NutriMind AI API",
    description="AI-powered nutrition intelligence backend",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import health, food, meals, chat, users, feedback, grocery, analytics, nutritionist

app.include_router(health.router)
app.include_router(food.router)
app.include_router(meals.router)
app.include_router(chat.router)
app.include_router(users.router)
app.include_router(feedback.router)
app.include_router(grocery.router)
app.include_router(analytics.router)
app.include_router(nutritionist.router)
