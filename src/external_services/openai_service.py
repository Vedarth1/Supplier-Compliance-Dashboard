import openai
from openai import OpenAIError

openai.api_key = ""

async def analyze_compliance(data):
    try:
        response = await openai.Completion.create(
            model="gpt-3.5-turbo",
            prompt=f"Analyze the following compliance data: {data}",
            max_tokens=150
        )
        return response.choices[0].text
    except OpenAIError as e:
        print("OpenAI API error:", e)
        return "Error in compliance analysis"
