import os
from django.shortcuts import render
from django.http import JsonResponse
from .services import OpenMeteoService
from .crops import suggest_crops

# Serve React index.html
def index(request):
    return render(request, 'index.html')

# Backend logic
weather_service = OpenMeteoService()

def summarize_forecast(forecast):
    if not forecast or "days" not in forecast:
        return None
    temps, rain = [], 0
    for day in forecast["days"]:
        if day["temperature_max"] and day["temperature_min"]:
            temps.append((day["temperature_max"] + day["temperature_min"]) / 2)
        rain += day.get("precipitation_sum", 0) or 0
    return {
        "avg_temp": sum(temps)/len(temps) if temps else None,
        "total_rain_mm": rain
    }

# Example JSON endpoint for React
def home_data(request):
    lat, lon = -28.741943, 24.771944
    loc = "Kimberley"

    current = weather_service.get_current_weather(lat, lon)
    forecast = weather_service.get_weather_forecast(lat, lon, days=7)
    summary = summarize_forecast(forecast)

    crops = suggest_crops(
        avg_temp=summary["avg_temp"] if summary else None,
        total_rain_mm=summary["total_rain_mm"] if summary else None,
    )

    payload = {
        "location": loc,
        "weather": current,
        "summary": summary,
        "crops": crops,
        "daily": forecast.get("days", []) if forecast else [],
    }
    return JsonResponse(payload)
