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
    path('', include(router.urls)),           # /crops, /locations, etc.
    path('home/', home_data, name='home_data'), # /home/ JSON endpoint
    path('token-auth/', obtain_auth_token, name='api_token_auth'), # /token-auth/
    path('', index, name='index'),            # catch-all for React
]
