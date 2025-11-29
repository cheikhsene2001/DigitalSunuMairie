
from rest_framework import serializers
from .models import Region, Departement, Commune, Mairie, DemandeCertificat

# -------------------------------
# 1️⃣ Sérialiseurs géographiques
# -------------------------------

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'nom']


class DepartementSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region', write_only=True
    )

    class Meta:
        model = Departement
        fields = ['id', 'nom', 'region', 'region_id']


class CommuneSerializer(serializers.ModelSerializer):
    departement = DepartementSerializer(read_only=True)
    departement_id = serializers.PrimaryKeyRelatedField(
        queryset=Departement.objects.all(), source='departement', write_only=True
    )

    class Meta:
        model = Commune
        fields = ['id', 'nom', 'departement', 'departement_id']


# -------------------------------
# 2️⃣ Sérialiseur Mairie (connexion + gestion)
# -------------------------------

class MairieSerializer(serializers.ModelSerializer):
    commune = CommuneSerializer(read_only=True)
    commune_id = serializers.PrimaryKeyRelatedField(
        queryset=Commune.objects.all(), source='commune', write_only=True
    )

    # ✅ champ virtuel pour mot de passe
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Mairie
        fields = [
            'id',
            'nom',
            'adresse',
            'region',
            'departement',
            'commune',
            'commune_id',
            'password',
            'must_change_password',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', '2025')  # mot de passe par défaut
        mairie = Mairie(**validated_data)
        mairie.set_password(password)
        mairie.save()
        return mairie

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# -------------------------------
# 3️⃣ Sérialiseur Login Mairie
# -------------------------------

class MairieLoginSerializer(serializers.Serializer):
    region = serializers.CharField()
    departement = serializers.CharField()
    commune = serializers.CharField()
    password = serializers.CharField(write_only=True)


# -------------------------------
# 4️⃣ Sérialiseur Demande de certificat
# -------------------------------

# class DemandeCertificatSerializer(serializers.ModelSerializer):
#     mairie = MairieSerializer(read_only=True)
#     mairie_id = serializers.PrimaryKeyRelatedField(
#         queryset=Mairie.objects.all(), source='mairie', write_only=True
#     )

#     class Meta:
#         model = DemandeCertificat
#         fields = [
#             'id',
#             'nom',
#             'prenom',
#             'email',
#             'telephone',
#             'type_certificat',  # ✅ AJOUT
#             'motif',
#             'date_demande',
#             'statut',
#             'mairie',
#             'mairie_id',
#         ]

class DemandeCertificatSerializer(serializers.ModelSerializer):
    mairie = MairieSerializer(read_only=True)
    mairie_id = serializers.PrimaryKeyRelatedField(
        queryset=Mairie.objects.all(), source='mairie', write_only=True
    )

    class Meta:
        model = DemandeCertificat
        fields = [
            'id',
            'nom',
            'prenom',
            'email',
            'telephone',
            'type_certificat',
            'numero_registre',
            'annee_declaration',
            'motif',
            'date_demande',
            'statut',
            'mairie',
            'mairie_id',
        ]
