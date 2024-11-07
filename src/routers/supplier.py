from fastapi import APIRouter, HTTPException
from src.schemas.supplier import SupplierResponse, SupplierBase, SupplierCreateRequest
from src.db import get_db
import json

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

@router.get("/suppliers/{supplier_id}", response_model=SupplierBase)
async def get_supplier_by_id(supplier_id: int):
    async with get_db() as db:
        try:
            supplier = await db.supplier.find_unique(where={"id": supplier_id}, include={'ComplianceRecords': True})

            if not supplier:
                raise HTTPException(status_code=404, detail="Supplier not found")

            return SupplierBase.from_orm(supplier)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve supplier: {str(e)}"
            )

@router.post("/create_supplier", response_model=SupplierBase)
async def create_supplier(supplier_data: SupplierCreateRequest):
    async with get_db() as db:
        try:
            supplier_dict = supplier_data.dict()
            supplier_dict['contract_terms'] = json.dumps(supplier_data.contract_terms)

            new_supplier = await db.supplier.create(data=supplier_dict)

            return SupplierBase.from_orm(new_supplier)

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create supplier: {str(e)}"
            )