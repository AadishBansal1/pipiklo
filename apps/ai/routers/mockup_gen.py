from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import asyncio
import random

router = APIRouter()


class MockupGenResult(BaseModel):
    id: str
    template: str
    result_url: str
    status: str


@router.post("/mockup", response_model=MockupGenResult)
async def generate_mockup(
    template: str = Form(..., description="t-shirt | mug | phone | poster | business-card | billboard"),
    design: UploadFile = File(...),
    background_color: Optional[str] = Form(None),
):
    """
    Place a design onto a product mockup template.

    Currently returns a mock response.
    Production: wire up Placeit API or a custom Pillow compositing service.
    """
    await asyncio.sleep(2.2)

    gen_id = f"mku_{random.randint(100000, 999999)}"
    seed = random.randint(1, 1000)

    return MockupGenResult(
        id=gen_id,
        template=template,
        result_url=f"https://picsum.photos/seed/{seed}/1200/900",
        status="complete",
    )
