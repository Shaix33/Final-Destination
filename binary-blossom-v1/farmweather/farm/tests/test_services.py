from django.test import TestCase
from unittest.mock import patch
from farm.services import OpenMeteoService

class WeatherServiceTests(TestCase):
    @patch("farm.services.requests.get")
    def test_get_current_weather_mock(self, mock_get):
        mock_get.return_value.json.return_value = {
            "current_weather": {"temperature": 25, "windspeed": 5}
        }
        service = OpenMeteoService()
        result = service.get_current_weather(-28.7, 24.7)
        self.assertEqual(result["temperature"], 25)

    @patch("farm.services.requests.get")
    def test_get_weather_forecast_mock(self, mock_get):
        mock_get.return_value.json.return_value = {
            "daily": {
                "temperature_2m_max": [30],
                "temperature_2m_min": [20],
                "precipitation_sum": [5]
            }
        }
        service = OpenMeteoService()
        forecast = service.get_weather_forecast(-28.7, 24.7, days=1)
        self.assertIn("days", forecast)
        self.assertEqual(forecast["days"][0]["temperature_max"], 30)
