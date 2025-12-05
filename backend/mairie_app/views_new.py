import io
import os
import qrcode
from django.http import HttpResponse
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view

from .models import Region, Departement, Commune, Mairie, DemandeCertificat
from .serializers import (
    RegionSerializer,
    DepartementSerializer,
    CommuneSerializer,
    MairieSerializer,
    DemandeCertificatSerializer,
)


# ========================
# 🔧 FUNCTIONS UTILITAIRES
# ========================

def generer_pdf_certificat(demande):
    """Génère un PDF pour une demande de certificat"""
    
    # --- QR CODE ---
    qr_text = (
        f"Type : {demande.get_type_certificat_display()}\n"
        f"Nom : {demande.nom}\n"
        f"Prénom : {demande.prenom}\n"
        f"Téléphone : {demande.telephone}\n"
        f"Email : {demande.email}\n"
        f"Motif : {demande.motif}\n"
        f"Mairie : {demande.mairie.commune}\n"
        f"Statut : {demande.statut}\n"
        f"N° Registre : {demande.numero_registre or '-'}\n"
        f"Année Déclaration : {demande.annee_declaration or '-'}\n"
    )

    qr = qrcode.make(qr_text)
    qr_buffer = io.BytesIO()
    qr.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    # --- PDF ---
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    p.setFont("Helvetica-Bold", 20)
    p.drawString(120, 800, "🇸🇳 Certification Officielle - Sénégal")

    p.setFont("Helvetica", 11)
    p.drawString(50, 760, f"Mairie : {demande.mairie.commune}")
    p.drawString(50, 740, f"Type : {demande.get_type_certificat_display()}")
    p.drawString(50, 720, f"Nom : {demande.nom}")
    p.drawString(50, 700, f"Prénom : {demande.prenom}")
    p.drawString(50, 680, f"Téléphone : {demande.telephone}")
    p.drawString(50, 660, f"Email : {demande.email}")
    p.drawString(50, 640, f"Motif : {demande.motif}")
    p.drawString(50, 620, f"Date de demande : {demande.date_demande.strftime('%d/%m/%Y')}")

    if demande.type_certificat == "naissance":
        p.drawString(50, 600, f"N° Registre : {demande.numero_registre}")
        p.drawString(50, 580, f"Année Déclaration : {demande.annee_declaration}")

    # QR Code
    p.drawInlineImage(qr_buffer, 380, 500, width=150, height=150)

    # Signature/Tampon
    p.setFont("Helvetica-Oblique", 10)
    p.drawString(50, 450, "Signature de l'agent :")
    p.drawString(50, 430, "_" * 50)

    p.drawString(50, 100, "Document généré automatiquement via Digital Sunu Mairie.")
    p.drawString(50, 80, f"ID Demande : {demande.id}")

    p.showPage()
    p.save()
    buffer.seek(0)

    return buffer


def envoyer_certificat_email(demande):
    """Envoie le certificat par email au citoyen"""
    
    if not demande.email:
        print(f"❌ Pas d'email pour {demande.nom} {demande.prenom}")
        return False

    try:
        # Générer le PDF
        pdf_buffer = generer_pdf_certificat(demande)
        
        # Créer l'email
        email = EmailMessage(
            subject=f"✅ Votre {demande.get_type_certificat_display()} - Digital Sunu Mairie",
            body=f"""Bonjour {demande.prenom} {demande.nom},

Bonne nouvelle ! Votre demande de {demande.get_type_certificat_display()} a été validée.

Veuillez trouver ci-joint votre certificat en format PDF.

Mairie de : {demande.mairie.commune}
Date de validation : {demande.date_demande.strftime('%d/%m/%Y à %H:%M')}

Cordialement,
L'équipe Digital Sunu Mairie
            """,
            from_email=os.getenv("EMAIL_HOST_USER", "admin@digitalsunumairie.sn"),
            to=[demande.email]
        )
        
        # Ajouter le PDF en pièce jointe
        email.attach(
            f"Certificat_{demande.nom}_{demande.id}.pdf",
            pdf_buffer.getvalue(),
            "application/pdf"
        )
        
        # Envoyer
        email.send()
        print(f"✅ Email envoyé à {demande.email}")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi : {str(e)}")
        return False


# ========================
# 1️⃣ VIEWSETS GÉOGRAPHIQUES
# ========================

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


# ========================
# 2️⃣ MAIRIE + DEMANDES
# ========================

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

    def get_queryset(self):
        queryset = super().get_queryset()
        mairie_id = self.request.query_params.get('mairie_id')

        if mairie_id:
            queryset = queryset.filter(mairie__id=mairie_id)
        return queryset

    # 🔥 CHANGEMENT STATUT
    @action(detail=True, methods=['post'])
    def changer_statut(self, request, pk=None):
        demande = self.get_object()
        nouveau_statut = request.data.get('statut')

        # ⚠️ IMPORTANT : respecter les statuts du MODEL
        if nouveau_statut not in ['EN_ATTENTE', 'VALIDEE', 'REFUSEE']:
            return Response({'error': 'Statut invalide.'}, status=400)

        demande.statut = nouveau_statut
        demande.save()

        # 🎯 SI VALIDEE : Générer et envoyer le certificat par email
        if nouveau_statut == 'VALIDEE':
            email_envoye = envoyer_certificat_email(demande)
            if email_envoye:
                message = f'✅ Statut changé en VALIDEE et certificat envoyé à {demande.email}'
            else:
                message = f'⚠️ Statut changé en VALIDEE mais erreur lors de l\'envoi du certificat'
        else:
            message = f'Statut changé en {nouveau_statut} ✅'

        return Response({'message': message})


# ========================
# 3️⃣ LOGIN MAIRIE
# ========================

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

    return Response({
        'message': 'Connexion réussie ✅',
        'mairie': MairieSerializer(mairie).data
    })


# ========================
# 4️⃣ TÉLÉCHARGER CERTIFICAT PDF
# ========================

def generer_certificat(request, demande_id):
    """Endpoint pour télécharger le certificat PDF"""
    demande = get_object_or_404(DemandeCertificat, pk=demande_id)

    if demande.statut != "VALIDEE":
        return HttpResponse("❌ Certificat non disponible : demande non validée.", status=403)

    pdf_buffer = generer_pdf_certificat(demande)
    
    return HttpResponse(
        pdf_buffer,
        content_type='application/pdf',
        headers={'Content-Disposition': f'attachment; filename="Certificat_{demande.nom}_{demande.id}.pdf"'}
    )
