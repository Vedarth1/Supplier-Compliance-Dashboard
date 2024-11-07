import google.generativeai as genai
from src.schemas.compliance import ComplianceInsight,ComplianceRecord,ComplianceAnalysisResult
import json
from pydantic import BaseModel
from typing import List
from fastapi import HTTPException
import os
from dotenv import load_dotenv
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

async def analyze_compliance_data(compliance_records: List[dict]):
    compliance_data_dict = [record.dict() if isinstance(record, BaseModel) else record for record in compliance_records]
    prompt = f"Analyze the compliance issues for supplier :\n{compliance_data_dict}\n"
    prompt += "Provide insights on non-compliance patterns and suggest ways to improve."
    
    try:
        response = model.generate_content(prompt)
        analysis = response.text.strip()
        return {"analysis": analysis}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze compliance data: {str(e)}")

async def generate_compliance_insights(compliance_records: List[ComplianceRecord]) -> ComplianceAnalysisResult:
    formatted_data = [
        {"metric": rec.metric, "result": rec.result, "date_recorded": rec.date_recorded.isoformat(), "status": rec.status}
        for rec in compliance_records
    ]
    
    prompt = f"Analyze the following compliance data for supplier and suggest improvements in compliance and contract terms:\n{formatted_data}"
    
    try:
        response = model.generate_content(prompt)
        analysis = response.text.strip()
        
        return ComplianceAnalysisResult(analysis=analysis)
    except Exception as e:
        raise Exception(f"Failed to generate insights: {str(e)}")