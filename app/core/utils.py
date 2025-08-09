def get_bp_category(systolic: int, diastolic: int) -> str:
    """
    Categorize blood pressure reading according to AHA guidelines
    
    Args:
        systolic: Systolic pressure in mmHg
        diastolic: Diastolic pressure in mmHg
        
    Returns:
        Blood pressure category string
    """
    if systolic < 120 and diastolic < 80:
        return "Normal"
    elif systolic < 130 and diastolic < 80:
        return "Elevated"
    elif (130 <= systolic <= 139) or (80 <= diastolic <= 89):
        return "High Blood Pressure Stage 1"
    elif systolic >= 140 or diastolic >= 90:
        return "High Blood Pressure Stage 2"
    elif systolic > 180 or diastolic > 120:
        return "Hypertensive Crisis"
    else:
        return "Unknown"