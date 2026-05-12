from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import asyncio
import random

router = APIRouter()


class MusicGenRequest(BaseModel):
    prompt: str
    duration: Optional[int] = 30
    genre: Optional[str] = None
    tempo: Optional[str] = "medium"
    mood: Optional[str] = None


class MusicGenResult(BaseModel):
    id: str
    prompt: str
    result_url: str
    duration: int
    waveform_url: str
    status: str


@router.post("/music", response_model=MusicGenResult)
async def generate_music(body: MusicGenRequest):
    """
    Generate music/audio from a text prompt.

    Currently returns a mock response.
    Production: wire up Meta MusicGen via Replicate or Suno API.
    """
    await asyncio.sleep(2.5)

    gen_id = f"mus_{random.randint(100000, 999999)}"
    seed = random.randint(1, 1000)

    return MusicGenResult(
        id=gen_id,
        prompt=body.prompt,
        result_url=f"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{random.randint(1, 16)}.mp3",
        duration=body.duration or 30,
        waveform_url=f"https://picsum.photos/seed/{seed}/800/100",
        status="complete",
    )
