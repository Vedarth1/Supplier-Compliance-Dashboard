from fastapi import FastAPI, Depends, HTTPException
from src.schemas import SupplierCreate, Supplier
import prisma
from src.routers import suppliers, compliance

app = FastAPI()

app.include_router(suppliers.router)
app.include_router(compliance.router)

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

@app.get("/")
async def root():
    return {"message": "Supplier Compliance Dashboard API"}
