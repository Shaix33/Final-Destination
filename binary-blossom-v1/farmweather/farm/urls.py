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
from .views import index, home_data, GoogleLoginView, RegisterView, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# ---- DRF routers for API endpoints ----
router = DefaultRouter()
router.register(r'crops', CropViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'weather', WeatherDataViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'search-history', UserSearchHistoryViewSet, basename='search_history')
router.register(r'reports', UserReportViewSet, basename='reports')

# ---- URL patterns ----
urlpatterns = [
    # API router
    path("api/", include(router.urls)),

    # Optional home data endpoint
    path("home_data/", home_data, name="home_data"),

    # JWT endpoints (username/password login)
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Custom registration & login endpoints
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", LoginView.as_view(), name="login"),

    # Google login endpoint
    path("api/auth/google/", GoogleLoginView.as_view(), name="google_login"),

    # React frontend fallback
    path("", index, name="index"),
]
