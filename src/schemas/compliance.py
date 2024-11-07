from pydantic import BaseModel
from typing import List, Dict, Union

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
