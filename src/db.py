from prisma import Prisma
from contextlib import asynccontextmanager

prisma = Prisma()

@asynccontextmanager
async def get_db():
    try:
        yield prisma
    finally:
        pass