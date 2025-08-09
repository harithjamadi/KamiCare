
from groq import Groq
import os
from config import settings

client = Groq(
    api_key=settings.GROQ_API,
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": 
            """
            Extract all numerical values and their corresponding units or labels displayed on the screen of the blood pressure monitor. Specifically, identify the systolic pressure (SYS), and diastolic pressure (DIA) ONLY. Present the extracted information clearly in JSON format, and don't generate any beside JSON. Use this JSON format for output:
            {
            "SYS": {
                "value": int,
            },
            "DIA": {
                "value": int,
            }
            }
            """,
        }
    ],
    model="meta-llama/llama-4-maverick-17b-128e-instruct",
    stream=False,
)

print(chat_completion.choices[0].message.content)
