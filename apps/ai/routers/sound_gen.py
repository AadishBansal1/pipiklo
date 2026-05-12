from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import asyncio
import random

router = APIRouter()


class SoundGenRequest(BaseModel):
    prompt: str
    duration: Optional[int] = 5
    category: Optional[str] = None


class SoundGenResult(BaseModel):
    id: str
    prompt: str
    result_url: str
    duration: int
    status: str


@router.post("/sound", response_model=SoundGenResult)
async def generate_sound(body: SoundGenRequest):
    """
    Generate a sound effect from a text prompt.

    Currently returns a mock response.
    Production: wire up ElevenLabs Sound Effects or AudioCraft.
    """
    await asyncio.sleep(1.8)

    gen_id = f"sfx_{random.randint(100000, 999999)}"

    return SoundGenResult(
        id=gen_id,
        prompt=body.prompt,
        result_url=f"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{random.randint(1, 16)}.mp3",
        duration=body.duration or 5,
        status="complete",
    )
