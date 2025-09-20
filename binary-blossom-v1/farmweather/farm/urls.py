from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    CropViewSet,
    LocationViewSet,
    WeatherDataViewSet,
    UserProfileViewSet,
    UserSearchHistoryViewSet,
    UserReportViewSet,
)
from .views import index, home_data, GoogleLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'crops', CropViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'weather', WeatherDataViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'search-history', UserSearchHistoryViewSet)
router.register(r'search_history', UserSearchHistoryViewSet, basename='search_history')
router.register(r'reports', UserReportViewSet, basename='reports')

urlpatterns = [
    path("api/", include(router.urls)),
    path("home_data/", home_data, name="home_data"),
    
    # JWT endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Google OAuth endpoint
    path("api/auth/google/", GoogleLoginView.as_view(), name="google_login"),

    path("", index, name="index"),  # React frontend fallback (must be last)
]
