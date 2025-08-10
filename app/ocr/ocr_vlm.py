import os
import shutil
import tempfile
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
from groq import Groq
import requests
import base64
import tkinter as tk
from tkinter import filedialog, messagebox

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / '.env')

GROQ_API = os.getenv("VLM_GROQ_API_KEY")
if not GROQ_API:
    raise ValueError("GROQ_API environment variable is not set.")

def select_image_file():
    """
    Open file dialog to select an image file
    Returns the selected file path or None if cancelled
    """
    # Create a root window and hide it
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)
    
    # Define supported image formats
    file_types = [
        ("Image files", "*.jpg *.jpeg *.png *.bmp *.gif *.tiff *.webp"),
        ("JPEG files", "*.jpg *.jpeg"),
        ("PNG files", "*.png"),
        ("All files", "*.*")
    ]
    
    # Open file dialog
    file_path = filedialog.askopenfilename(
        title="Select Blood Pressure Monitor Image",
        filetypes=file_types,
        initialdir=os.path.expanduser("~")  # Start in user's home directory
    )
    
    root.destroy()
    return file_path if file_path else None

def copy_to_temp_folder(source_path):
    """
    Copy selected image to a temporary folder
    Returns the path to the copied file in temp folder
    """
    if not source_path or not os.path.exists(source_path):
        raise FileNotFoundError(f"Source image file not found: {source_path}")
    
    # Create temp directory if it doesn't exist
    temp_dir = Path(tempfile.gettempdir()) / "kamicare_images"
    temp_dir.mkdir(exist_ok=True)
    
    # Generate unique filename with timestamp
    source_file = Path(source_path)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_filename = f"{timestamp}_{source_file.name}"
    temp_path = temp_dir / temp_filename
    
    # Copy file to temp directory
    shutil.copy2(source_path, temp_path)
    print(f"Image copied to temp folder: {temp_path}")
    
    return str(temp_path)

def cleanup_old_temp_files(temp_dir, max_age_hours=24):
    """
    Clean up old temporary files (older than max_age_hours)
    """
    try:
        temp_path = Path(temp_dir)
        if not temp_path.exists():
            return
        
        current_time = datetime.now()
        for file_path in temp_path.iterdir():
            if file_path.is_file():
                file_age = current_time - datetime.fromtimestamp(file_path.stat().st_mtime)
                if file_age.total_seconds() > (max_age_hours * 3600):
                    file_path.unlink()
                    print(f"Cleaned up old temp file: {file_path}")
    except Exception as e:
        print(f"Warning: Could not clean up temp files: {e}")

def process_blood_pressure_image(image_path):
    """
    Process the blood pressure monitor image using Groq VLM
    """
    client = Groq(api_key=GROQ_API)
    
    # Read and encode image
    with open(image_path, "rb") as img_file:
        img_base64 = base64.b64encode(img_file.read()).decode("utf-8")
    
    # Create chat completion request
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Extract all numerical values and their corresponding units or labels 
                        displayed on the screen of the blood pressure monitor. Specifically, identify 
                        the systolic pressure (SYS), and diastolic pressure (DIA) ONLY. Present the 
                        extracted information clearly in JSON format, and don't generate anything 
                        besides JSON. Use this JSON format:
                        {
                            "SYS": { "value": int },
                            "DIA": { "value": int }
                        }"""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{img_base64}"
                        }
                    }
                ]
            }
        ],
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        stream=False,
    )
    
    return chat_completion.choices[0].message.content

def send_to_server(sys_value, dia_value, patient_id=1):
    """
    Send blood pressure data to the server
    """
    data = {
        "patient_id": patient_id,
        "datetime": datetime.now().isoformat(),
        "systolic": sys_value,
        "diastolic": dia_value
    }
    
    response = requests.post("http://localhost:8000/api/v1/blood-pressure/readings", json=data)
    return response

def main():
    """
    Main function to orchestrate the blood pressure reading process
    """
    try:
        # Clean up old temporary files
        temp_dir = Path(tempfile.gettempdir()) / "kamicare_images"
        cleanup_old_temp_files(temp_dir)
        
        # Step 1: Select image file
        print("Please select a blood pressure monitor image...")
        selected_image = select_image_file()
        
        if not selected_image:
            print("No image selected. Exiting...")
            return
        
        print(f"Selected image: {selected_image}")
        
        # Step 2: Copy to temp folder
        temp_image_path = copy_to_temp_folder(selected_image)
        
        # Step 3: Process image with Groq VLM
        print("Processing image with Groq VLM...")
        response_content = process_blood_pressure_image(temp_image_path)
        print("Groq Response:", response_content)
        
        # Step 4: Parse response
        import json
        response_data = json.loads(response_content)
        
        sys_value = response_data.get("SYS", {}).get("value")
        dia_value = response_data.get("DIA", {}).get("value")
        
        if sys_value is None or dia_value is None:
            raise ValueError("SYS or DIA value not found in Groq response.")
        
        print(f"Extracted values - SYS: {sys_value}, DIA: {dia_value}")
        
        # Step 5: Send to server
        print("Sending data to server...")
        server_response = send_to_server(sys_value, dia_value)
        print("Server Response:", server_response.json())
        
        # Step 6: Optional cleanup of the specific temp file
        # Uncomment the next line if you want to delete the temp file immediately after processing
        # Path(temp_image_path).unlink()
        
        print("Blood pressure reading processed successfully!")
        
    except FileNotFoundError as e:
        print(f"File error: {e}")
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print(f"Raw response: {response_content}")
    except requests.RequestException as e:
        print(f"Server communication error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        
        # Clean up temp file on error
        if 'temp_image_path' in locals() and Path(temp_image_path).exists():
            Path(temp_image_path).unlink()
            print(f"Cleaned up temp file: {temp_image_path}")

if __name__ == "__main__":
    main()