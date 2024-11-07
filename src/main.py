from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.routers import supplier, compliance
from src.db import prisma

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await prisma.connect()
        yield
    finally:
        await prisma.disconnect()

app = FastAPI(lifespan=lifespan)
app.include_router(supplier.router)
app.include_router(compliance.router)