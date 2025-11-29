from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Region, Departement, Commune, Mairie, DemandeCertificat
from .serializers import (
    RegionSerializer,
    DepartementSerializer,
    CommuneSerializer,
    MairieSerializer,
    DemandeCertificatSerializer,
)


# -------------------------------
# 1️⃣ ViewSets géographiques
# -------------------------------

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all().order_by('nom')
    serializer_class = RegionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom']


class DepartementViewSet(viewsets.ModelViewSet):
    queryset = Departement.objects.select_related('region').order_by('nom')
    serializer_class = DepartementSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'region__nom']


class CommuneViewSet(viewsets.ModelViewSet):
    queryset = Commune.objects.select_related('departement', 'departement__region').order_by('nom')
    serializer_class = CommuneSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'departement__nom', 'departement__region__nom']


# -------------------------------
# 2️⃣ ViewSets mairie + demandes
# -------------------------------

class MairieViewSet(viewsets.ModelViewSet):
    queryset = Mairie.objects.select_related('commune').order_by('nom')
    serializer_class = MairieSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'commune__nom']


class DemandeCertificatViewSet(viewsets.ModelViewSet):
    queryset = DemandeCertificat.objects.select_related('mairie').order_by('-date_demande')
    serializer_class = DemandeCertificatSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'prenom', 'mairie__nom', 'statut']

    # ✅ Filtrer les demandes selon la mairie connectée
    def get_queryset(self):
        queryset = super().get_queryset()
        mairie_id = self.request.query_params.get('mairie_id')
        if mairie_id:
            queryset = queryset.filter(mairie__id=mairie_id)
        return queryset

    # ✅ Exemple de route personnalisée : changer le statut d’une demande
    @action(detail=True, methods=['post'])
    def changer_statut(self, request, pk=None):
        """Permet de changer le statut d'une demande"""
        demande = self.get_object()
        nouveau_statut = request.data.get('statut')

        if nouveau_statut not in ['EN_ATTENTE', 'VALIDE', 'REJETE']:
            return Response({'error': 'Statut invalide.'}, status=400)

        demande.statut = nouveau_statut
        demande.save()
        return Response({'message': f'Statut changé en {nouveau_statut} ✅'})



from rest_framework.decorators import api_view
from rest_framework.response import Response

# ✅ Endpoint de connexion mairie
@api_view(['POST'])
def mairie_login(request):
    region = request.data.get('region')
    departement = request.data.get('departement')
    commune = request.data.get('commune')
    password = request.data.get('password')

    if not all([region, departement, commune, password]):
        return Response({'error': 'Tous les champs sont requis.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        mairie = Mairie.objects.get(region=region, departement=departement, commune_id=commune)
    except Mairie.DoesNotExist:
        return Response({'error': 'Aucune mairie trouvée.'}, status=status.HTTP_404_NOT_FOUND)

    if not mairie.check_password(password):
        return Response({'error': 'Mot de passe incorrect.'}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = MairieSerializer(mairie)
    return Response({
        'message': 'Connexion réussie ✅',
        'mairie': serializer.data
    })