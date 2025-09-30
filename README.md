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
cd binary-blossom-v1/

**Backend**
<!-- Navigate to backend Directory -->
cd /farmweather/
<!-- Create and activate virtual environment -->
python -m venv venv
source venv/bin/activate <!-- Linux/Mac -->
.venv\Scripts\activate <!-- Windows -->

<!-- Install dependencies -->
pip install -r requirements

<!-- Run migrations -->
python manage.py migrate

<!-- Start development server -->
python manage.py runserver

**Frontend**
cd ../binary-blossom-frontend/

<!-- Install dependencies -->
npm install

<!-- start development server -->
npm run dev

## Project Structure






API Endpoints
Endpoint                    	Method	                      Description
/api/auth/register            POST                          New user registration
/api/auth/login               POST                          Existing user login
/api/auth/google              POST                          Google OAuth login
/api/token/refresh            POST                          Refresh JWT token
/api/home/  	                GET                           Get crop and weather data
/api/search-history           GET/POST                      Get/save search history
/api/reports/                 GET/POST                      Get/generate reports

