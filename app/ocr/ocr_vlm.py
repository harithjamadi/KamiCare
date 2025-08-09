import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
from groq import Groq
import requests

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / '.env')

GROQ_API = os.getenv("GROQ_API_KEY")
if not GROQ_API:
    raise ValueError("GROQ_API environment variable is not set.")

client = Groq(api_key=GROQ_API)

chat_completion = client.chat.completions.create(
    messages=[{
        "role": "user",
        "content": """
        Extract all numerical values and their corresponding units or labels displayed on the screen of the blood pressure monitor. Specifically, identify the systolic pressure (SYS), and diastolic pressure (DIA) ONLY. Present the extracted information clearly in JSON format, and don't generate any beside JSON. Use this JSON format for output:
        {
            "SYS": {
                "value": int,
            },
            "DIA": {
                "value": int,
            }
        }
        """
    }],
    model="meta-llama/llama-4-maverick-17b-128e-instruct",
    stream=False,
)

response_content = chat_completion.choices[0].message.content
print("Groq Response:", response_content)

import json
response_data = json.loads(response_content)

sys_value = response_data.get("SYS", {}).get("value")
dia_value = response_data.get("DIA", {}).get("value")

if sys_value is None or dia_value is None:
    raise ValueError("SYS or DIA value not found in Groq response.")

data = {
    "patient_id": 1,  # need to change based on login id
    "datetime": datetime.now().isoformat(),  # Use current timestamp
    "systolic": sys_value,  # Systolic pressure value
    "diastolic": dia_value   # Diastolic pressure value
}

response = requests.post("http://localhost:8000/api/v1/blood-pressure/readings", json=data)

print("Server Response:", response.json())
