import requests

MAPMYCROP_BASE_URL = "https://mapmycrop.com/api/v1/monitor"

def fetch_crop_monitoring_data(lat, lon):
    params = {
        "latitude": lat,
        "longitude": lon,
        "format": "json"
    }

    try:
        response = requests.get(MAPMYCROP_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        return {
            "ndvi": data.get("ndvi"),
            "evi": data.get("evi"),
            "crop_health": data.get("crop_health"),
            "timestamp": data.get("timestamp")
        }
    except requests.RequestException as e:
        return {"error": str(e)}