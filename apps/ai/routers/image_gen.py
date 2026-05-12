from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncio
import random

router = APIRouter()


class ImageGenRequest(BaseModel):
    prompt: str
    style: Optional[str] = "realistic"
    width: Optional[int] = 1024
    height: Optional[int] = 1024
    negative_prompt: Optional[str] = None


class GenerationResult(BaseModel):
    id: str
    tool: str
    prompt: str
    result_url: str
    status: str
    width: int
    height: int


@router.post("/image", response_model=GenerationResult)
async def generate_image(request: ImageGenRequest):
    """
    Generate an image from a text prompt using AI.

    Currently returns a mock response. Wire up Replicate/OpenAI DALL-E 3/Stability AI
    by setting the appropriate API keys in .env.
    """
    # Simulate processing time
    await asyncio.sleep(1.5)

    generation_id = f"img_{random.randint(100000, 999999)}"
    seed = random.randint(1, 1000)

    # Mock: return a picsum placeholder
    # Production: call OpenAI DALL-E 3 or Stability AI
    result_url = f"https://picsum.photos/seed/{seed}/{request.width}/{request.height}"

    return GenerationResult(
        id=generation_id,
        tool="image-gen",
        prompt=request.prompt,
        result_url=result_url,
        status="complete",
        width=request.width,
        height=request.height,
    )
