from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegionViewSet,
    DepartementViewSet,
    CommuneViewSet,
    MairieViewSet,
    DemandeCertificatViewSet,
    PaiementViewSet,
    mairie_login,
    generer_certificat
)

router = DefaultRouter()
router.register(r'regions', RegionViewSet)
router.register(r'departements', DepartementViewSet)
router.register(r'communes', CommuneViewSet)
router.register(r'mairies', MairieViewSet)
router.register(r'demandes', DemandeCertificatViewSet)
router.register(r'paiements', PaiementViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('mairie/login/', mairie_login, name='mairie_login'),
    path("certificat/<int:demande_id>/pdf/", generer_certificat, name="generer_certificat"),
]
