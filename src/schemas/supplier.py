from pydantic import BaseModel
from typing import Dict, Union, List, Optional
from datetime import datetime

class ComplianceRecordBase(BaseModel):
    id: int
    supplier_id: int
    metric: str
    date_recorded: datetime
    result: str
    status: str

    class Config:
        from_attributes = True

class SupplierBase(BaseModel):
    id: int
    name: str
    country: str
    compliance_score: int
    contract_terms: Dict[str, Union[str, int, bool]]
    last_audit: Optional[datetime] = None
    ComplianceRecords: List[ComplianceRecordBase] = []

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, model):
        last_audit = model.last_audit
        if isinstance(last_audit, datetime):
            last_audit = last_audit.isoformat()
        compliance_records = model.ComplianceRecords or []

        return cls(
            id=model.id,
            name=model.name,
            country=model.country,
            compliance_score=model.compliance_score,
            contract_terms=model.contract_terms,
            last_audit=last_audit,
            ComplianceRecords=compliance_records,
        )

class SupplierResponse(BaseModel):
    success: bool
    data: List[SupplierBase]
    message: str
    total: int

    class Config:
        from_attributes = True
