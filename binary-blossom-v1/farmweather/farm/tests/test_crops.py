from django.test import TestCase
from farm.crops import suggest_crops

class CropSuggestionTests(TestCase):
    def test_suggest_crops_hot_and_wet(self):
        crops = suggest_crops(avg_temp=28, total_rain_mm=100)
        self.assertIn("Maize", crops)

    def test_suggest_crops_cool_and_dry(self):
        crops = suggest_crops(avg_temp=18, total_rain_mm=20)
        self.assertIn("Wheat", crops)

    def test_suggest_crops_empty_if_no_data(self):
        crops = suggest_crops(avg_temp=None, total_rain_mm=None)
        self.assertEqual(crops, [])
