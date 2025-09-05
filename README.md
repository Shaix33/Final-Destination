# FarmWeather

FarmWeather is a web application that provides weather forecasts and crop recommendations for farmers. It combines a Django REST API backend with a React frontend to deliver real-time weather and agricultural guidance.

## Features

- View current weather and 7-day forecasts for a location.
- Receive crop recommendations based on temperature and rainfall.
- CRUD API endpoints for crops, locations, weather data, and user profiles.
- Token-based authentication for secure API access.
- Single-page React frontend served via Django.

## Project Structure

farmweather/
├─ farmweather/ # Django project settings
├─ farm/ # Django app
│ ├─ api_views.py # DRF ViewSets
│ ├─ views.py # React entry point & JSON endpoints
│ ├─ models.py
│ ├─ serializers.py
│ ├─ urls.py
│ ├─ static/ # React build assets
│ └─ templates/ # index.html
└─ binary-blossom-frontend/ # React project
Running the Application

Start the Django backend:

python manage.py runserver


Access the application in your browser at:

http://127.0.0.1:8000/


React frontend is served from Django in production (index.html under farm/templates).

API Endpoints
Endpoint	Method	Description
/crops/	GET/POST	List/Create crops
/locations/	GET/POST	List/Create locations
/weather/	GET	Get weather data
/profiles/	GET/POST	List/Create user profiles
/home/	GET	JSON endpoint for React frontend
/token-auth/	POST	Obtain authentication token
Backend Services

OpenMeteoService: Fetches weather data from Open-Meteo API.

Crops.suggest_crops(): Suggests crops based on forecasted weather conditions.
