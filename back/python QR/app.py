from io import BytesIO

from fastapi import FastAPI, Query, Response
from fastapi.middleware.cors import CORSMiddleware
import segno

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/generate-qr")
def generate_qr(url: str = Query(..., min_length=1)):
    """Return a PNG QR code for the provided URL."""
    qr = segno.make(url, error="m")
    buffer = BytesIO()
    qr.save(
        buffer,
        kind="png",
        scale=6,
        border=2,
        dark="#1f2b3a",
        light="white",
    )
    return Response(content=buffer.getvalue(), media_type="image/png")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
