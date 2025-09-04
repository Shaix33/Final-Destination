# 🌱 FarmWeather – Smart Farming & Weather Insights Platform

FarmWeather is a Django-based web application that combines **real-time weather data**, **satellite crop monitoring**, and **rule-based agricultural recommendations** to help farmers make informed decisions.  
It integrates with APIs like **OpenMeteo** and **MapMyCrop** to deliver actionable insights for crop selection, planting schedules, and farm management.

---

## 📋 Features

- **User Profiles** – Store farm details, contact info, and preferences.
- **Location Management** – Track multiple farm locations with geospatial data.
- **Weather Data** – Fetch and store current and historical weather from OpenMeteo.
- **Crop Database** – Maintain detailed crop profiles with optimal growing conditions.
- **Recommendations Engine** – Suggest crops based on climate classification and satellite data.
- **Admin Panel Enhancements** – Custom list displays, quick actions, and data fetch buttons.
- **Caching Layer** – Reduce API calls with Django’s caching framework.
- **Defensive Programming** – Handles malformed API responses and missing data gracefully.

---

## 🗂 Project Structure

|--binary-blossom
|  |--


binary-blossom-frontend/
├── index.html
├── package.json
├── vite.config.js
├── jsconfig.json
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   └── ExampleComponent.jsx
│   ├── pages/
│   │   └── Home.jsx
│   └── styles/
│       └── main.css
└── .gitignore