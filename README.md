# Binary Blossom

Binary Blossom is a web application that provides weather forecasts and crop recommendations for farmers. It combines a Django REST API backend with a React frontend to deliver real-time weather and agricultural guidance.

<img width="1187" height="789" alt="Recent" src="https://github.com/user-attachments/assets/57ee34f6-3164-4eec-9bf7-312a6315a52c" />

## Features

### **Core Features**
- ** Real-time Weather data**: View current weather and 7-day forecasts for a location.
- **Crop Recommendations**: Receive crop recommendations based on temperature and rainfall.
- **Location and Search**: find insights for any location.
- **Crop availability checker**: determine if crops are suitable for a specific location.
- **Search history**: Track previously searched locations.
- **Generate reports**: Create and save detailed agricultural reports.
- **Dark & Light mode**: Customizable UI theme background for user experience.
- **CRUD API endpoints for crops, locations, weather data, and user profiles.
- **Token-based authentication for secure API access.

### **Technical Features**
- **React.js** frontend with Material UI components.
- **Django REST framework** backend
- **JWT Tokens** authentication
- **Google OAuth** authentication
- **OpenWeatherMap API** for weather data
- **OpenStreetMap Nomatim API** reverse geolocation.

### Prerequisites
- **Visual Studio Code** IDE
- **Node.js** (v20+)
- **npm or yarn**
- **Python** (v13+)
- **Django** (v5+)
- **Docker Desktop** (optional)

### Installation

git clone https://github.com/Shaix33/Final-Destination.git
cd cd binary-blossom-v1

**Backend**

## Project Structure


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
