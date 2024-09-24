from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkBoardViewSet

router = DefaultRouter()
router.register(r'workboards', WorkBoardViewSet, basename='workboard')

urlpatterns = [
    path('api/', include(router.urls)),
]