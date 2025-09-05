from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from farm.models import Crop

class APITests(APITestCase):
    def setUp(self):
        self.crop = Crop.objects.create(
            name="Test Maize",
            scientific_name="Zea mays",
            min_temp=20,
            max_temp=30,
            min_rainfall=50,
            max_rainfall=200
        )

    def test_crop_list(self):
        url = reverse("crop-list")  # DRF router auto-generates names
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_home_data(self):
        url = reverse("home_data")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("location", response.json())
        self.assertIn("crops", response.json())
