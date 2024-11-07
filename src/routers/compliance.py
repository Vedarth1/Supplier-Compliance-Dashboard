from fastapi import APIRouter, HTTPException
from src.schemas.compliance import ComplianceCheckRequest, ComplianceAnalysisResponse
from src.external_services.openai_service import analyze_compliance_data

router = APIRouter()

@router.post("/suppliers/check-compliance", response_model=ComplianceAnalysisResponse)
async def check_compliance(data: ComplianceCheckRequest):
    try:
        compliance_issues = await analyze_compliance_data(data.compliance_records)
        
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