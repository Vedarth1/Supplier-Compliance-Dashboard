from fastapi import APIRouter, HTTPException
from src.schemas.supplier import SupplierResponse,SupplierBase
from src.db import get_db

router = APIRouter()

@router.get("/suppliers", response_model=SupplierResponse)
async def get_suppliers():
    async with get_db() as db:
        try:
            suppliers = await db.supplier.find_many(include={'ComplianceRecords': True})
            return SupplierResponse(
                success=True,
                data=[SupplierBase.from_orm(supplier) for supplier in suppliers],
                message="Suppliers retrieved successfully",
                total=len(suppliers),
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve suppliers: {str(e)}"
            )

