# farm/crops.py

"""
Crop suggestion logic based on weather conditions.
Now linked to the Crop model.
"""

from typing import List, Dict, Optional
from django.db.models import Q
from .models import Crop


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

    # 🔍 Query DB for crops matching the given weather conditions
    crops = Crop.objects.filter(
        Q(optimal_temp_min__lte=avg_temp) & Q(optimal_temp_max__gte=avg_temp),
        Q(optimal_rainfall_min__lte=total_rain_mm) & Q(optimal_rainfall_max__gte=total_rain_mm),
    )

    suggestions = []

    for crop in crops:
        suggestions.append({
            "name": crop.name,
            "scientific_name": crop.scientific_name,
            "category": crop.category,
            "reason": (
                f"Best grown in {avg_temp:.1f}°C and {total_rain_mm:.0f} mm rainfall "
                f"(Optimal range: {crop.optimal_temp_min}-{crop.optimal_temp_max}°C, "
                f"{crop.optimal_rainfall_min}-{crop.optimal_rainfall_max} mm)"
            )
        })

    # If DB has no matches → fall back to default rules
    if not suggestions:
        suggestions = _fallback_suggestions(avg_temp, total_rain_mm)

    return suggestions


def _fallback_suggestions(avg_temp: float, total_rain_mm: float) -> List[Dict[str, str]]:
    rules = []

    # 🌽 Maize
    if 18 <= avg_temp <= 27 and total_rain_mm >= 100:
        rules.append({"name": "Maize", "reason": "Thrives in warm weather, can tolerate low rainfall"})

    # 🌾 Wheat
    if 10 <= avg_temp <= 28 and total_rain_mm >= 50:
        rules.append({"name": "Wheat", "reason": "Suitable for cooler climates, tolerates low rainfall"})

    # 🌱 Sorghum
    if 18 <= avg_temp <= 32 and total_rain_mm >= 20:
        rules.append({"name": "Sorghum", "reason": "Drought-tolerant, semi-arid friendly"})

    # 🌻 Sunflower
    if 18 <= avg_temp <= 32 and total_rain_mm >= 50:
        rules.append({"name": "Sunflower", "reason": "Handles warmer climates with moderate rain"})

    # 🥜 Groundnuts
    if 22 <= avg_temp <= 30 and total_rain_mm >= 200:
        rules.append({"name": "Groundnuts", "reason": "Warm conditions with steady rainfall"})

    # 🍚 Rice
    if 20 <= avg_temp <= 30 and total_rain_mm >= 1000:
        rules.append({"name": "Rice", "reason": "Tropical, heavy rainfall required"})

    # 🥔 Potatoes
    if 15 <= avg_temp <= 22 and total_rain_mm >= 50:
        rules.append({"name": "Potatoes", "reason": "Cool climates with consistent rain"})

    # 🍌 Bananas
    if 20 <= avg_temp <= 32 and total_rain_mm >= 800:
        rules.append({"name": "Bananas", "reason": "Hot and humid, rainfall above 800 mm"})

    # 🍊 Citrus
    if 13 <= avg_temp <= 32 and total_rain_mm >= 50:
        rules.append({"name": "Citrus", "reason": "Prefers warm climates and good rainfall"})

    # 🍅 Tomatoes
    if 18 <= avg_temp <= 28 and total_rain_mm >= 50:
        rules.append({"name": "Tomatoes", "reason": "Warm growing season, steady moisture"})

    # 🫘 Beans
    if 16 <= avg_temp <= 28 and total_rain_mm >= 30:
        rules.append({"name": "Beans", "reason": "Moderate climates with reliable rain"})

    # 🍉 Watermelon
    if 20 <= avg_temp <= 32 and total_rain_mm >= 20:
        rules.append({"name": "Watermelon", "reason": "Needs heat, tolerates lower rainfall"})

    # 🥭 Mangoes
    if 24 <= avg_temp <= 32 and total_rain_mm >= 200:
        rules.append({"name": "Mangoes", "reason": "Tropical crop with seasonal rain dependency"})

    # 🌵 Ultra-drought crops (new)
    if total_rain_mm < 20:
        rules.append({"name": "Cactus", "reason": "Extremely drought-tolerant, minimal rainfall required"})
        rules.append({"name": "Millet", "reason": "Survives hot, dry climates with very little water"})
        rules.append({"name": "Teff", "reason": "Can grow in semi-arid regions with poor rainfall"})

    # Default fallback
    if not rules:
        rules.append({
            "name": "No clear recommendation",
            "reason": f"Conditions ({avg_temp:.1f}°C, {total_rain_mm:.0f} mm) do not match known profiles"
        })

    return rules
