# farmweather/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),         # Django admin
    path("", include("farmweather.farm.urls")),          # Include farm app routes
]
