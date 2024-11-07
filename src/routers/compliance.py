from fastapi import APIRouter, HTTPException
from src.schemas.compliance import ComplianceCheckRequest, ComplianceAnalysisResponse,ComplianceInsightsWithAnalysisResponse
from src.external_services.openai_service import analyze_compliance_data,generate_compliance_insights
from src.db import get_db

router = APIRouter()

@router.post("/suppliers/check-compliance", response_model=ComplianceAnalysisResponse)
async def check_compliance(data: ComplianceCheckRequest):
    async with get_db() as db:
        try:
            past_record=await db.compliancerecord.find_many(where={"supplier_id": data.supplier_id})
            compliancerecords=past_record+data.compliance_records
            compliance_issues = await analyze_compliance_data(compliancerecords)
            
            return ComplianceAnalysisResponse(
                success=True,
                message="Compliance data analyzed successfully",
                insights=compliance_issues,
            )

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to analyze compliance data: {str(e)}"
            )
    
@router.get("/suppliers/insights/{supplier_id}", response_model=ComplianceInsightsWithAnalysisResponse)
async def get_insights(supplier_id: int):
    async with get_db() as db:
        try:
            compliance_records = await db.compliancerecord.find_many(where={"supplier_id": supplier_id})
            result = await generate_compliance_insights(compliance_records)

            return ComplianceInsightsWithAnalysisResponse(
                success=True,
                analysis=result.analysis,
            )
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve insights: {str(e)}"
            )
