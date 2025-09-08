# farm/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import CropViewSet, LocationViewSet, WeatherDataViewSet, UserProfileViewSet
from .views import index, home_data
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'crops', CropViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'weather', WeatherDataViewSet)
router.register(r'profiles', UserProfileViewSet)

urlpatterns = [
    path("api/", include(router.urls)),        # All API endpoints
    path("home/", home_data, name="home_data"), # JSON endpoint for weather/crops
    path("api/token-auth/", obtain_auth_token), # Token auth

    # IMPORTANT: React fallback must always be last
    path("", index, name="index"),
]
