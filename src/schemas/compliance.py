from pydantic import BaseModel
from typing import List, Dict, Union
from datetime import date

class ComplianceRecord(BaseModel):
    metric: str
    value: Union[str, int, float]
    status: str

class ComplianceCheckRequest(BaseModel):
    supplier_id: int
    compliance_records: List[ComplianceRecord]

class ComplianceAnalysisResponse(BaseModel):
    success: bool
    message: str
    insights: Dict[str, str]

class getComplianceRecord(BaseModel):
    supplier_id: int
    metric: str
    result: str
    date_recorded: date
    status: str

class ComplianceInsight(BaseModel):
    suggestion: str
    recommendation: str

class ComplianceInsightsWithAnalysisResponse(BaseModel):
    success: bool
    analysis: str
    insights: List[ComplianceInsight]

class ComplianceAnalysisResult(BaseModel):
    analysis: str
    insights: List[ComplianceInsight]