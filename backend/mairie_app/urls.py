from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    RegionViewSet,
    DepartementViewSet,
    CommuneViewSet,
    MairieViewSet,
    DemandeCertificatViewSet,
)

# Création du routeur pour les endpoints automatiques
router = DefaultRouter()
router.register(r'regions', RegionViewSet)
router.register(r'departements', DepartementViewSet)
router.register(r'communes', CommuneViewSet)
router.register(r'mairies', MairieViewSet)
router.register(r'demandes', DemandeCertificatViewSet)

# Routes explicites (non gérées par le router)
urlpatterns = [
    path('', include(router.urls)),
    path('mairie/login/', views.mairie_login, name='mairie_login'),
]
