# farm/crops.py

"""
Crop suggestion logic based on weather conditions.
"""

from typing import List, Optional, Dict


def suggest_crops(avg_temp: Optional[float], total_rain_mm: Optional[float]) -> List[Dict[str, str]]:
    """
    Suggest crops based on average temperature and rainfall.

    Args:
        avg_temp (float): Average temperature in °C.
        total_rain_mm (float): Total rainfall in mm.

    Returns:
        List[Dict[str, str]]: Suggested crops with reasoning.
    """

    if avg_temp is None or total_rain_mm is None:
        return [{"name": "Unknown", "reason": "Insufficient weather data"}]

    suggestions = []

    # Maize
    if 18 <= avg_temp <= 27 and total_rain_mm >= 300:
        suggestions.append({
            "name": "Maize",
            "reason": f"Thrives in {avg_temp:.1f}°C and {total_rain_mm:.0f} mm rainfall"
        })

    # Wheat
    if 10 <= avg_temp <= 24 and 250 <= total_rain_mm <= 1000:
        suggestions.append({
            "name": "Wheat",
            "reason": f"Suitable for cooler climates with {total_rain_mm:.0f} mm rainfall"
        })

    # Sorghum
    if 20 <= avg_temp <= 30 and 400 <= total_rain_mm <= 800:
        suggestions.append({
            "name": "Sorghum",
            "reason": "Drought-tolerant and grows in semi-arid regions"
        })

    # Sunflower
    if 18 <= avg_temp <= 30 and 300 <= total_rain_mm <= 600:
        suggestions.append({
            "name": "Sunflower",
            "reason": "Tolerates moderate rainfall and warmer weather"
        })

    # Groundnuts
    if 22 <= avg_temp <= 28 and 500 <= total_rain_mm <= 1000:
        suggestions.append({
            "name": "Groundnuts",
            "reason": "Prefers sandy soils, warm climates and steady rainfall"
        })

    # Default fallback
    if not suggestions:
        suggestions.append({
            "name": "No clear recommendation",
            "reason": f"Conditions ({avg_temp:.1f}°C, {total_rain_mm:.0f} mm) do not match known crop profiles"
        })

    return suggestions
