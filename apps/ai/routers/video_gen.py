from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import asyncio
import random

router = APIRouter()


class VideoGenRequest(BaseModel):
    prompt: str
    style: Optional[str] = "cinematic"
    duration: Optional[int] = 5
    aspect_ratio: Optional[str] = "16:9"


class VideoGenResult(BaseModel):
    id: str
    prompt: str
    result_url: str
    thumbnail_url: str
    duration: int
    status: str


@router.post("/video", response_model=VideoGenResult)
async def generate_video(body: VideoGenRequest):
    """
    Generate a video from a text prompt.

    Currently returns a mock response.
    Production: wire up Replicate (zeroscope-v2-xl) or RunwayML.
    """
    await asyncio.sleep(3.0)

    gen_id = f"vid_{random.randint(100000, 999999)}"
    seed = random.randint(1, 1000)

    return VideoGenResult(
        id=gen_id,
        prompt=body.prompt,
        result_url=f"https://picsum.photos/seed/{seed}/1280/720",
        thumbnail_url=f"https://picsum.photos/seed/{seed}/640/360",
        duration=body.duration or 5,
        status="complete",
    )
