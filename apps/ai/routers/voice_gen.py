from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import asyncio
import random

router = APIRouter()


class VoiceGenRequest(BaseModel):
    text: str
    voice: Optional[str] = "alloy"
    speed: Optional[float] = 1.0
    language: Optional[str] = "en"


class VoiceGenResult(BaseModel):
    id: str
    text: str
    voice: str
    result_url: str
    duration_estimate: float
    status: str


@router.post("/voice", response_model=VoiceGenResult)
async def generate_voice(body: VoiceGenRequest):
    """
    Convert text to speech (TTS).

    Currently returns a mock response.
    Production: wire up OpenAI TTS or ElevenLabs.
    """
    await asyncio.sleep(1.5)

    gen_id = f"tts_{random.randint(100000, 999999)}"
    words = len(body.text.split())
    duration_estimate = round(words / 2.5, 1)

    return VoiceGenResult(
        id=gen_id,
        text=body.text,
        voice=body.voice or "alloy",
        result_url=f"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{random.randint(1, 16)}.mp3",
        duration_estimate=duration_estimate,
        status="complete",
    )
