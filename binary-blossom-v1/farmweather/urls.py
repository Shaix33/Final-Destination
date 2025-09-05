from django.contrib import admin
from django.urls import path, include, re_path
from farmweather.farm import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('farmweather.farm.urls')),  # all API + JSON endpoints
    path('api/auth/', include('rest_framework.urls')),  # DRF login/logout
    re_path(r'^.*$', views.index),  # catch-all React frontend
]
