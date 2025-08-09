import requests
import json
from datetime import datetime

data = {
    "datetime": datetime.now().isoformat(),
    "sys": 125,
    "dia": 82
}

response = requests.post(
    "http://localhost:8000/hypertension",
    json=data
)

print(response.json())