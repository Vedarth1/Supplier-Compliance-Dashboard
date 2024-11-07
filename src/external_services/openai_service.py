import google.generativeai as genai
import time
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
    prompt = f"Analyze the following compliance data for potential issues:\n{json.dumps(compliance_data_dict)}"
    
    try:
        response = model.generate_content(prompt)
        analysis = response.text.strip()
        return {"analysis": analysis}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze compliance data: {str(e)}")
