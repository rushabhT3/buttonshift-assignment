from django.urls import path
from .views import register, login

urlpatterns = [
    path('api/signup/', register, name='register'),
    path('api/signin/', login, name='login'),
]
