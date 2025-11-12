from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 

from .views import registration_view, UserProfileView, MyTokenObtainPairView

urlpatterns = [
    path("register/", registration_view),
    path("api/token/", MyTokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("profile/", UserProfileView.as_view())
]