def get_bp_category(systolic: int, diastolic: int) -> str:
    """
    Determine blood pressure category based on systolic and diastolic readings
    Based on American Heart Association guidelines
    """
    if systolic < 120 and diastolic < 80:
        return "Normal"
    elif systolic < 130 and diastolic < 80:
        return "Elevated"
    elif (120 <= systolic <= 129) and diastolic < 80:
        return "Elevated"
    elif (130 <= systolic <= 139) or (80 <= diastolic <= 89):
        return "High Blood Pressure Stage 1"
    elif (140 <= systolic <= 179) or (90 <= diastolic <= 119):
        return "High Blood Pressure Stage 2"
    elif systolic >= 180 or diastolic >= 120:
        return "Hypertensive Crisis"
    else:
        return "Unknown"