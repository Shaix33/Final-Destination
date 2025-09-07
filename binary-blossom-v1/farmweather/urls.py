from django.contrib import admin
from django.urls import path, include, re_path
from farmweather.farm import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('farmweather.farm.urls')),
    path('api/auth/', include('rest_framework.urls')),
    re_path(r'^.*$', views.index),  # Catch-all for React
]
