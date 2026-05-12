from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import asyncio
import random

router = APIRouter()


class ImageEditResult(BaseModel):
    id: str
    operation: str
    result_url: str
    status: str


@router.post("/image", response_model=ImageEditResult)
async def edit_image(
    operation: str = Form(..., description="remove-background | enhance | upscale | erase-object"),
    image: UploadFile = File(...),
    mask: Optional[UploadFile] = File(None),
):
    """
    Edit an existing image — remove background, enhance quality, upscale, or erase objects.

    Currently returns a mock response.
    Production: wire up Replicate (remove-bg), Real-ESRGAN (upscale), etc.
    """
    await asyncio.sleep(2.0)

    edit_id = f"edit_{random.randint(100000, 999999)}"
    seed = random.randint(1, 1000)
    result_url = f"https://picsum.photos/seed/{seed}/1024/1024"

    return ImageEditResult(
        id=edit_id,
        operation=operation,
        result_url=result_url,
        status="complete",
    )
