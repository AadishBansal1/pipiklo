from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import image_gen, image_edit, video_gen, music_gen, voice_gen, sound_gen, graphics_gen, mockup_gen

load_dotenv()

app = FastAPI(
    title="Pipiklo AI Services",
    description="AI-powered creative generation tools for Pipiklo",
    version="1.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image_gen.router, prefix="/generate", tags=["Image Generation"])
app.include_router(image_edit.router, prefix="/edit", tags=["Image Editing"])
app.include_router(video_gen.router, prefix="/generate", tags=["Video Generation"])
app.include_router(music_gen.router, prefix="/generate", tags=["Music Generation"])
app.include_router(voice_gen.router, prefix="/generate", tags=["Voice Generation"])
app.include_router(sound_gen.router, prefix="/generate", tags=["Sound Generation"])
app.include_router(graphics_gen.router, prefix="/generate", tags=["Graphics Generation"])
app.include_router(mockup_gen.router, prefix="/generate", tags=["Mockup Generation"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "Pipiklo AI"}


@app.get("/")
async def root():
    return {
        "service": "Pipiklo AI Services",
        "tools": ["image-gen", "image-edit", "video-gen", "music-gen", "voice-gen", "sound-gen", "graphics-gen", "mockup-gen"],
        "docs": "/docs",
    }
