from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now

from .models import Crop, Location, WeatherData, UserProfile, UserSearchHistory, UserReport
from .serializers import (
    CropSerializer,
    LocationSerializer,
    WeatherDataSerializer,
    UserProfileSerializer,
    UserSearchHistorySerializer,
    UserReportSerializer,
)
from .services import OpenMeteoService
from .crops import suggest_crops


# ----------------------
# Crop API Endpoints
# ----------------------
class CropViewSet(viewsets.ModelViewSet):
    """
    Manage crops (CRUD).
    Includes an extra endpoint for weather-based crop recommendations.
    """
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"])
    def recommendations(self, request):
        """
        Suggest crops based on the user’s primary location forecast.
        """
        user = request.user
        if not hasattr(user, "userprofile") or not user.userprofile.primary_location:
            return Response({"error": "No primary location set"}, status=400)

        location = user.userprofile.primary_location
        forecast = location.get_weather_forecast(days=5)
        if not forecast:
            return Response({"error": "No forecast data"}, status=400)

        avg_temp = sum(
            [day["temperature_max"] for day in forecast["days"] if day["temperature_max"]]
        ) / len(forecast["days"])
        total_rain = sum(day["precipitation_sum"] for day in forecast["days"])

        crops = suggest_crops(avg_temp, total_rain)
        return Response({"suggested_crops": crops})


# ----------------------
# Location API Endpoints
# ----------------------
class LocationViewSet(viewsets.ModelViewSet):
    """
    Manage user’s locations (CRUD).
    Includes actions to fetch current weather and forecast for each location.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"])
    def current_weather(self, request, pk=None):
        location = self.get_object()
        return Response(location.get_current_weather())

    @action(detail=True, methods=["get"])
    def forecast(self, request, pk=None):
        location = self.get_object()
        return Response(location.get_weather_forecast())


# ----------------------
# WeatherData API Endpoints
# ----------------------
class WeatherDataViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for historical weather data.
    """
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    permission_classes = [permissions.IsAuthenticated]


# ----------------------
# User Profile API Endpoints
# ----------------------
class UserProfileViewSet(viewsets.ModelViewSet):
    """
    Manage user profiles (CRUD).
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserSearchHistoryViewSet(viewsets.ModelViewSet):
    """
    Track user search history (authenticated users only).
    """
    serializer_class = UserSearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserSearchHistory.objects.all()

    def get_queryset(self):
        # Only return history for the logged-in user
        return UserSearchHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ----------------------
# User Report API Endpoints
# ----------------------

class UserReportViewSet(viewsets.ModelViewSet):
    """
    Manage user reports (authenticated users only).
    """
    serializer_class = UserReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserReport.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
