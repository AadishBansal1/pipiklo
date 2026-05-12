from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import random

router = APIRouter()


class GraphicsGenRequest(BaseModel):
    prompt: str
    style: Optional[str] = "vector"
    format: Optional[str] = "svg"
    colors: Optional[List[str]] = None
    count: Optional[int] = 1


class GraphicsGenResult(BaseModel):
    id: str
    prompt: str
    result_urls: List[str]
    format: str
    status: str


@router.post("/graphics", response_model=GraphicsGenResult)
async def generate_graphics(body: GraphicsGenRequest):
    """
    Generate vector graphics / icons / illustrations from a prompt.

    Currently returns a mock response.
    Production: wire up Stability AI (SVG generation) or Recraft.
    """
    await asyncio.sleep(2.0)

    gen_id = f"gfx_{random.randint(100000, 999999)}"
    count = min(body.count or 1, 4)
    result_urls = [
        f"https://picsum.photos/seed/{random.randint(1, 9999)}/512/512"
        for _ in range(count)
    ]

    return GraphicsGenResult(
        id=gen_id,
        prompt=body.prompt,
        result_urls=result_urls,
        format=body.format or "svg",
        status="complete",
    )
