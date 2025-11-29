import json
from django.core.management.base import BaseCommand
from mairie_app.models import Region, Departement, Commune, Mairie


class Command(BaseCommand):
    help = "Importe les régions, départements, communes et crée automatiquement les mairies avec mot de passe par défaut."

    def handle(self, *args, **options):
        # ✅ Charger le fichier JSON
        try:
            with open("mairie_app/data/communes.json", encoding="utf-8") as f:
                data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ Fichier 'mairie_app/data/communes.json' introuvable."))
            return

        created_regions = 0
        created_departements = 0
        created_communes = 0
        created_mairies = 0

        # ✅ Parcourir les régions
        for region_data in data:
            region_name = region_data["region"]
            region_obj, region_created = Region.objects.get_or_create(nom=region_name)
            if region_created:
                created_regions += 1

            # ✅ Parcourir les départements de la région
            for departement_data in region_data["departements"]:
                departement_name = departement_data["nom"]
                departement_obj, dep_created = Departement.objects.get_or_create(
                    nom=departement_name,
                    region=region_obj
                )
                if dep_created:
                    created_departements += 1

                # ✅ Parcourir les communes du département
                for commune_name in departement_data["communes"]:
                    commune_obj, commune_created = Commune.objects.get_or_create(
                        nom=commune_name,
                        departement=departement_obj
                    )
                    if commune_created:
                        created_communes += 1

                    mairie_obj, mairie_created = Mairie.objects.get_or_create(
                         commune=commune_obj,
                        #  nom=f"Mairie de {commune}",
                         nom=f"Mairie de {commune_obj.nom}",

                         defaults={
                           "region": region_name,
                           "departement": departement_name,
                         }
                    )
                    if mairie_created:
                       mairie_obj.set_password("2025")
                       mairie_obj.save()
                    

        # ✅ Résumé
        self.stdout.write(self.style.SUCCESS("✅ Importation terminée avec succès !"))
        self.stdout.write(self.style.SUCCESS(f"➡️  Régions créées : {created_regions}"))
        self.stdout.write(self.style.SUCCESS(f"➡️  Départements créés : {created_departements}"))
        self.stdout.write(self.style.SUCCESS(f"➡️  Communes créées : {created_communes}"))
        self.stdout.write(self.style.SUCCESS(f"➡️  Mairies créées : {created_mairies}"))


# from django.core.management.base import BaseCommand
# from mairie_app.models import Region, Departement, Commune
# import json
# import os

# class Command(BaseCommand):
#     help = 'Importe les régions, départements et communes depuis communes.json'

#     def handle(self, *args, **kwargs):
#         file_path = os.path.join('mairie_app', 'data', 'communes.json')

#         with open(file_path, 'r', encoding='utf-8') as f:
#             data = json.load(f)

#         for region_data in data:
#             region_nom = region_data.get("region")
#             region_obj, _ = Region.objects.get_or_create(nom=region_nom)

#             for dep_data in region_data.get("departements", []):
#                 dep_nom = dep_data.get("nom")
#                 dep_obj, _ = Departement.objects.get_or_create(nom=dep_nom, region=region_obj)

#                 for commune_nom in dep_data.get("communes", []):
#                     Commune.objects.get_or_create(nom=commune_nom, departement=dep_obj)

#         self.stdout.write(self.style.SUCCESS("✅ Importation réussie de toutes les régions, départements et communes !"))
# mairie_app/management/commands/import_mairies.py
