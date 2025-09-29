import requests
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import render
from django.http import JsonResponse
from geopy.geocoders import Nominatim
from .services import OpenMeteoService
from .crops import suggest_crops
from .models import UserSearchHistory, UserReport, Location
from .serializers import UserSearchHistorySerializer, UserReportSerializer

# React app
def index(request):
    return render(request, "index.html")


weather_service = OpenMeteoService()

# Existing helpers
def summarize_forecast(forecast):
    if not forecast or "days" not in forecast:
        return None
    temps, rain = [], 0
    for day in forecast["days"]:
        if day["temperature_max"] and day["temperature_min"]:
            temps.append((day["temperature_max"] + day["temperature_min"]) / 2)
        rain += day.get("precipitation_sum", 0) or 0
    return {
        "avg_temp": sum(temps) / len(temps) if temps else None,
        "total_rain_mm": rain,
    }

def reverse_geocode(lat, lon):
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
        headers = {"User-Agent": "binary-blossom-app"}
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code == 200:
            data = res.json()
            address = data.get("address", {})
            return {
                "address": address.get("road") or address.get("neighbourhood") or address.get("suburb") or data.get("display_name", "").split(",")[0],
                "city": address.get("city") or address.get("town") or address.get("village") or "",
                "country": address.get("country", ""),
            }
    except Exception as e:
        print("Geocoding error:", e)
    return {"address": "", "city": "", "country": ""}


from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder

def home_data(request):
    try:
        lat = float(request.GET.get("lat"))
        lon = float(request.GET.get("lon"))
    except (TypeError, ValueError):
        lat, lon = -28.741943, 24.771944

    loc = reverse_geocode(lat, lon)
    if not loc:
        loc = {"address": f"{lat:.2f}, {lon:.2f}", "city": "", "country": ""}

    current = weather_service.get_current_weather(lat, lon)
    forecast = weather_service.get_weather_forecast(lat, lon, days=7)
    summary = summarize_forecast(forecast)

    crops = suggest_crops(
        avg_temp=summary["avg_temp"] if summary else None,
        total_rain_mm=summary["total_rain_mm"] if summary else None,
    )

    # Add unique IDs to all crops (DB crops already have IDs; fallback crops get synthetic ones)
    for i, crop in enumerate(crops):
        if "id" not in crop or crop["id"] is None:
            crop["id"] = f"fallback-{i}"

    # Save search if user is authenticated
    if request.user.is_authenticated:
        location_obj, _ = Location.objects.get_or_create(
            user=request.user,
            name=loc["address"],
            latitude=lat,
            longitude=lon,
            city=loc["city"],
            country=loc["country"],
        )
        UserSearchHistory.objects.create(user=request.user, location=location_obj)

    payload = {
        "location": loc,
        "weather": current,
        "summary": summary,
        "crops": crops,
        "daily": forecast.get("days", []) if forecast else [],
    }
    return JsonResponse(payload)




# -------------------------------
# API endpoints for frontend
# -------------------------------

class UserSearchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = UserSearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSearchHistory.objects.filter(user=self.request.user)

class UserReportViewSet(viewsets.ModelViewSet):
    serializer_class = UserReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserReport.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=["post"])
    def generate(self, request):
        """
        Example: generate a new report from latest searches or weather.
        """
        title = request.data.get("title", "New Report")
        description = request.data.get("description", "")
        data = request.data.get("data", {})

        report = UserReport.objects.create(
            user=request.user, title=title, description=description, data=data
        )
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allow public access
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"username": user.username, "email": user.email},
        })


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Fix: Accept both username and email
        username = request.data.get("username") or request.data.get("email")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"username": user.username, "email": user.email},
        })


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        id_token = request.data.get("token")
        if not id_token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
            response.raise_for_status()
            user_info = response.json()
        except requests.RequestException:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        email = user_info.get("email")
        if not email:
            return Response({"error": "Email not found in token"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(username=email, defaults={"email": email})
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"username": user.username, "email": user.email},
        })