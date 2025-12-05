

from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Region(models.Model):
    nom = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Région"
        verbose_name_plural = "Régions"

    def __str__(self):
        return self.nom


class Departement(models.Model):
    nom = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='departements')

    class Meta:
        verbose_name = "Département"
        verbose_name_plural = "Départements"
        unique_together = ('nom', 'region')

    def __str__(self):
        return f"{self.nom} ({self.region.nom})"


class Commune(models.Model):
    nom = models.CharField(max_length=100)
    departement = models.ForeignKey(Departement, on_delete=models.CASCADE, related_name='communes')

    class Meta:
        verbose_name = "Commune"
        verbose_name_plural = "Communes"
        unique_together = ('nom', 'departement')

    def __str__(self):
        return f"{self.nom} ({self.departement.nom})"


# -------------------------------
# 2️⃣ Mairie et gestion des certificats
# -------------------------------
class Mairie(models.Model):
    commune = models.ForeignKey(Commune, on_delete=models.CASCADE, related_name='mairies')
    nom = models.CharField(max_length=150)
    adresse = models.TextField(blank=True, null=True)

    # Champs de connexion
    region = models.CharField(max_length=100)
    departement = models.CharField(max_length=100)
    password_hash = models.CharField(max_length=128)
    must_change_password = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)

    def save(self, *args, **kwargs):
        # Si pas encore de mot de passe, on met "2025" par défaut
        if not self.password_hash:
            self.set_password("2025")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Mairie de {self.commune.nom} ({self.departement} - {self.region})"


# class DemandeCertificat(models.Model):
#     STATUT_CHOICES = [
#         ('EN_ATTENTE', 'En attente'),
#         ('VALIDEE', 'Validée'),
#         ('REFUSEE', 'Refusée'),
#     ]

#     TYPE_CERTIFICAT_CHOICES = [
#         ('naissance', 'Certificat de naissance'),
#         ('mariage', 'Certificat de mariage'),
#         ('deces', 'Certificat de décès'),
#         ('residence', 'Certificat de résidence'),
#     ]

#     nom = models.CharField(max_length=100)
#     prenom = models.CharField(max_length=100)
#     email = models.EmailField(blank=True, null=True)
#     telephone = models.CharField(max_length=20, blank=True, null=True)

#     # ✅ Ce champ existait déjà, on le garde
#     type_certificat = models.CharField(max_length=20, choices=TYPE_CERTIFICAT_CHOICES, default='naissance')

#     # ✅ Champs spéciaux pour certificat de naissance
#     numero_registre = models.CharField(max_length=50, null=True, blank=True)
#     annee_declaration = models.CharField(max_length=4, null=True, blank=True)

#     motif = models.TextField(blank=True, null=True)
#     date_demande = models.DateTimeField(auto_now_add=True)
#     statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='EN_ATTENTE')
#     mairie = models.ForeignKey(Mairie, on_delete=models.CASCADE, related_name='demandes')

#     class Meta:
#         verbose_name = "Demande de Certificat"
#         verbose_name_plural = "Demandes de Certificat"

#     def __str__(self):
#         return f"{self.prenom} {self.nom} | {self.get_type_certificat_display()} | {self.statut}"

class DemandeCertificat(models.Model):
    STATUT_CHOICES = [
        ('EN_ATTENTE', 'En attente'),
        ('VALIDEE', 'Validée'),
        ('REFUSEE', 'Refusée'),
    ]

    TYPE_CERTIFICAT_CHOICES = [
        ('naissance', 'Certificat de naissance'),
        ('mariage', 'Certificat de mariage'),
        ('deces', 'Certificat de décès'),
        ('residence', 'Certificat de résidence'),
    ]

    # Identité du citoyen
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)

    # Type du certificat demandé
    type_certificat = models.CharField(max_length=20, choices=TYPE_CERTIFICAT_CHOICES)

    # Champs spécifiques pour certificat de naissance
    numero_registre = models.CharField(max_length=50, null=True, blank=True)
    annee_declaration = models.CharField(max_length=4, null=True, blank=True)

    # Détails généraux
    motif = models.TextField(blank=True, null=True)
    date_demande = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='EN_ATTENTE')

    # Lien avec la mairie
    mairie = models.ForeignKey(Mairie, on_delete=models.CASCADE, related_name='demandes')

    def __str__(self):
        return f"{self.prenom} {self.nom} | {self.get_type_certificat_display()} | {self.statut}"

    class Meta:
        verbose_name = "Demande de Certificat"
        verbose_name_plural = "Demandes de Certificat"
        ordering = ['-date_demande']


# ========================
# 3️⃣ PAIEMENTS (Wave/Orange Money)
# ========================

class Paiement(models.Model):
    """Modèle pour gérer les paiements des certificats"""
    
    STATUT_PAIEMENT_CHOICES = [
        ('EN_ATTENTE', 'En attente'),
        ('EFFECTUE', 'Effectué'),
        ('ECHEC', 'Échec'),
        ('ANNULE', 'Annulé'),
    ]
    
    METHODE_PAIEMENT_CHOICES = [
        ('PAYTECH', 'PayTech'),
        ('MANUEL', 'Manuel (Mairie)'),
    ]
    
    # Lien avec la demande de certificat
    demande = models.OneToOneField(DemandeCertificat, on_delete=models.CASCADE, related_name='paiement')
    
    # Info paiement
    montant = models.DecimalField(max_digits=10, decimal_places=2, default=500)  # En CFA (500 FCFA par défaut)
    methode = models.CharField(max_length=20, choices=METHODE_PAIEMENT_CHOICES, default='PAYTECH')
    statut = models.CharField(max_length=20, choices=STATUT_PAIEMENT_CHOICES, default='EN_ATTENTE')
    
    # Infos transaction paiement en ligne
    reference_transaction = models.CharField(max_length=100, null=True, blank=True, unique=True)
    numero_telephone = models.CharField(max_length=20, blank=True, null=True)  # Pour trace
    
    # Dates
    date_creation = models.DateTimeField(auto_now_add=True)
    date_paiement = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Paiement"
        verbose_name_plural = "Paiements"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"Paiement {self.demande.id} - {self.montant} FCFA - {self.statut}"
