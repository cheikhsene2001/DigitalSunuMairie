import io
import os
import qrcode
from PIL import Image
from django.http import HttpResponse
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404
from django.utils import timezone
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
import json

from .models import Region, Departement, Commune, Mairie, DemandeCertificat, Paiement
from .serializers import (
    RegionSerializer,
    DepartementSerializer,
    CommuneSerializer,
    MairieSerializer,
    DemandeCertificatSerializer,
    PaiementSerializer,
)
from .paytech_service import request_payment as paytech_request_payment
from .paytech_service import check_payment_status as paytech_check_status


# ========================
# 🔧 FUNCTIONS UTILITAIRES
# ========================

def generer_pdf_certificat(demande):
    """Génère un PDF pour une demande de certificat - Format officiel sénégalais"""
    
    # --- QR CODE ---
    qr_text = (
        f"Type : {demande.get_type_certificat_display()}\n"
        f"Nom : {demande.nom}\n"
        f"Prénom : {demande.prenom}\n"
        f"Demande ID : {demande.id}\n"
        f"Mairie : {demande.mairie.commune}\n"
    )

    qr = qrcode.make(qr_text)
    # Convertir en PIL Image RGB pour ReportLab (nécessaire pour le format PNG)
    if qr.mode != 'RGB':
        qr = qr.convert('RGB')
    qr_buffer = io.BytesIO()
    qr.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    # --- PDF ---
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # ===== HEADER =====
    # Titre principal à gauche
    p.setFont("Helvetica-Bold", 11)
    y = height - 40
    p.drawString(50, y, "RÉGION DE " + (demande.mairie.commune.departement.region.nom.upper() if demande.mairie.commune.departement else ""))
    y -= 15
    p.drawString(50, y, "DÉPARTEMENT DE " + (demande.mairie.commune.departement.nom.upper() if demande.mairie.commune.departement else ""))
    y -= 15
    p.drawString(50, y, "COMMUNE DE " + demande.mairie.commune.nom.upper())
    y -= 15
    p.drawString(50, y, "CENTRE D'ÉTAT - CIVIL")

    # Titre à droite
    p.setFont("Helvetica-Bold", 16)
    p.drawRightString(width - 50, height - 40, "ÉTAT - CIVIL")
    
    p.setFont("Helvetica-Bold", 10)
    p.drawRightString(width - 50, height - 60, "République DU SÉNÉGAL")
    
    p.setFont("Helvetica", 8)
    p.drawRightString(width - 50, height - 75, "Un Peuple - Un But - Une Foi")

    # ===== MAIN CONTENT =====
    y = height - 120

    # Type de certificat
    p.setFont("Helvetica-Bold", 14)
    if demande.type_certificat == "naissance":
        p.drawCentredString(width / 2, y, "EXTRAIT du REGISTRE des ACTES de NAISSANCE")
    elif demande.type_certificat == "mariage":
        p.drawCentredString(width / 2, y, "EXTRAIT du REGISTRE des ACTES de MARIAGE")
    elif demande.type_certificat == "deces":
        p.drawCentredString(width / 2, y, "EXTRAIT du REGISTRE des ACTES de DÉCÈS")
    else:
        p.drawCentredString(width / 2, y, f"CERTIFICAT DE {demande.type_certificat.upper()}")

    y -= 30

    # Infos année et numéro
    p.setFont("Helvetica", 10)
    year = demande.annee_declaration if demande.annee_declaration else demande.date_demande.year
    p.drawString(50, y, f"Pour l'année (2) : {year}")
    p.drawRightString(width - 50, y, f"AN {year}")

    y -= 20
    p.drawString(50, y, f"N° dans le Registre : {demande.numero_registre or 'N/A'}")
    p.drawRightString(width - 50, y, f"N° : {demande.id}")

    y -= 30

    # Infos personnelles
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, y, "LE PREMIER ")
    
    p.setFont("Helvetica", 10)
    p.drawString(180, y, demande.date_demande.strftime("%d %B %Y").upper())

    y -= 20
    p.setFont("Helvetica-Bold", 9)
    p.drawString(50, y, "HEURE(S) MINUTE(S)")
    p.drawString(280, y, "est né(e) à")
    p.drawRightString(width - 50, y, demande.mairie.commune.nom.upper())

    # Infos enfant
    y -= 30
    p.setFont("Helvetica", 10)
    p.drawString(70, y, "un enfant de sexe ")
    p.drawString(250, y, "Masculin")
    
    y -= 25
    p.setFont("Helvetica-Bold", 11)
    p.drawString(70, y, demande.nom.upper())
    p.drawString(250, y, "Prénom")
    
    y -= 25
    p.drawString(50, y, "de")
    
    y -= 20
    p.setFont("Helvetica", 10)
    p.drawString(70, y, demande.prenom.upper())
    p.drawString(250, y, "Prénoms")
    
    y -= 25
    p.drawString(50, y, "et de")

    # Séparation
    y -= 30
    p.setLineWidth(0.5)
    p.line(50, y, width - 50, y)

    # QR Code
    y -= 50
    # Ouvrir le PNG depuis le buffer
    qr_image = Image.open(qr_buffer)
    p.drawInlineImage(qr_image, width - 150, y - 80, width=100, height=100)

    # Signature et tampon
    y -= 50
    p.setFont("Helvetica-Bold", 11)
    p.drawString(50, y, "EXTRAIT DELIVRÉ PAR LE CENTRE")
    
    y -= 20
    p.drawString(50, y, "PRINCIPAL DE " + demande.mairie.commune.nom.upper())
    
    y -= 30
    p.setFont("Helvetica", 9)
    p.drawString(50, y, "L'Officier d'État-Civil soussigné")
    
    y -= 20
    p.drawString(50, y, "Fait à " + demande.mairie.commune.nom.upper() + f", le {demande.date_demande.strftime('%d %B %Y')}")

    # Footer
    y = 40
    p.setFont("Helvetica", 8)
    p.drawString(50, y, "Document généré par Digital Sunu Mairie")
    p.drawRightString(width - 50, y, f"Demande N° {demande.id}")

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

    # ✅ VÉRIFIER QUE LE PAIEMENT EST EFFECTUÉ
    try:
        paiement = Paiement.objects.get(demande=demande)
        if paiement.statut != "EFFECTUE":
            return HttpResponse(
                "❌ Paiement requis : veuillez effectuer le paiement avant de télécharger le certificat.",
                status=402  # Payment Required
            )
    except Paiement.DoesNotExist:
        # Si pas de paiement, on crée un automatiquement (pour certificat gratuit)
        Paiement.objects.create(
            demande=demande,
            montant=0,
            methode='MANUEL',
            statut='EFFECTUE'
        )

    pdf_buffer = generer_pdf_certificat(demande)
    
    return HttpResponse(
        pdf_buffer,
        content_type='application/pdf',
        headers={'Content-Disposition': f'attachment; filename="Certificat_{demande.nom}_{demande.id}.pdf"'}
    )


# ========================
# 5️⃣ PAIEMENTS
# ========================

class PaiementViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les paiements"""
    queryset = Paiement.objects.all().order_by('-date_creation')
    serializer_class = PaiementSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['demande__id', 'reference_transaction', 'numero_telephone']

    @action(detail=False, methods=['post'])
    def creer_paiement(self, request):
        """Crée un paiement via PayTech et retourne l'URL de redirection"""
        demande_id = (
            request.data.get('demande_id')
            or request.query_params.get('demande_id')
            or request.POST.get('demande_id')
        )

        montant = (
            request.data.get('montant')
            or request.query_params.get('montant')
            or request.POST.get('montant')
            or 500
        )

        try:
            montant = int(montant)
        except (TypeError, ValueError):
            montant = 500

        try:
            demande_id = int(demande_id) if demande_id is not None else None
        except (TypeError, ValueError):
            demande_id = None

        print(f"🔍 DEBUG: creer_paiement appelé - demande_id={demande_id}, montant={montant}")
        try:
            raw_body = request.body.decode('utf-8') if isinstance(request.body, (bytes, bytearray)) else str(request.body)
        except Exception:
            raw_body = '<impossible à décoder>'
        headers = getattr(request, 'headers', {})
        print(f"🔍 DEBUG: request.headers => {dict(headers)}")
        print(f"🔍 DEBUG: request.body brut => {raw_body}")
        print(f"🔍 DEBUG: request.content_type => {request.content_type}")
        print(f"🔍 DEBUG: request.data => {request.data}")

        if not demande_id:
            return Response({'error': 'demande_id est requis.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            demande = DemandeCertificat.objects.get(pk=demande_id)
            print(f"✅ Demande trouvée: {demande.id}")
        except DemandeCertificat.DoesNotExist:
            print(f"❌ Demande {demande_id} non trouvée")
            return Response({'error': 'Demande non trouvée.'}, status=status.HTTP_404_NOT_FOUND)

        # Créer ou récupérer le paiement
        paiement, created = Paiement.objects.get_or_create(
            demande=demande,
            defaults={
                'methode': 'PAYTECH',
                'montant': montant,
                'statut': 'EN_ATTENTE'
            }
        )

        print(f"💳 Paiement créé/récupéré: {paiement.id}")

        # Appel PayTech pour obtenir l'URL de paiement
        # Utiliser un timestamp pour rendre la référence unique à chaque tentative
        import time
        ref_command = f"CERT_{demande.id}_{int(time.time())}"
        custom_field = {
            "demande_id": demande.id,
            "paiement_id": paiement.id,
            "nom": demande.nom,
            "prenom": demande.prenom,
            "email": demande.email,
        }

        paytech_response = paytech_request_payment(
            item_name=f"Certificat #{demande.id}",
            item_price=int(montant),
            ref_command=ref_command,
            command_name="Paiement certificat",
            custom_field=custom_field,
        )

        print("🔍 Réponse PayTech brute:", paytech_response)

        # Selon la doc PayTech, success peut être 1/0
        success = paytech_response.get("success") in (1, "1", True, "true")

        if not success:
            message = paytech_response.get("message", "Erreur PayTech")
            print(f"❌ Erreur PayTech: {message}")
            return Response(
                {"error": message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        url_paiement = (
            paytech_response.get("redirect_url")
            or paytech_response.get("payment_url")
            or paytech_response.get("redirect")
        )

        if not url_paiement:
            print(f"❌ Réponse PayTech sans URL: {paytech_response}")
            return Response(
                {"error": "URL de paiement introuvable dans la réponse PayTech"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Sauvegarder la référence de transaction
        paiement.reference_transaction = ref_command
        paiement.save()

        print(f"✅ URL PayTech: {url_paiement}")

        return Response({
            "message": "Paiement initialisé via PayTech",
            "paiement_id": paiement.id,
            "url_paiement": url_paiement,
            "montant": montant,
            "devise": "XOF",
        })

    @action(detail=False, methods=['post'])
    def webhook(self, request):
        """Webhook générique pour recevoir la confirmation de paiement"""
        try:
            data = request.data
            external_id = data.get('external_id')  # Format: CERT_14
            status_paiement = data.get('status')  # 'success', 'failed', 'cancelled'
            transaction_id = data.get('id')
            
            # Extraire l'ID de la demande
            if not external_id or not external_id.startswith('CERT_'):
                return Response({'error': 'Format externe invalide'}, status=status.HTTP_400_BAD_REQUEST)
            
            demande_id = int(external_id.split('_')[1])
            
            try:
                paiement = Paiement.objects.get(demande_id=demande_id)
            except Paiement.DoesNotExist:
                return Response({'error': 'Paiement non trouvé'}, status=status.HTTP_404_NOT_FOUND)

            # Mettre à jour le statut du paiement
            if status_paiement == 'success':
                paiement.statut = 'EFFECTUE'
                paiement.reference_transaction = transaction_id
                paiement.date_paiement = timezone.now()
                paiement.save()
                
                # Auto-valider la demande après paiement réussi
                demande = paiement.demande
                if demande.statut != 'VALIDEE':
                    demande.statut = 'VALIDEE'
                    demande.save()
                    print(f"✅ Demande #{demande.id} auto-validée après paiement")
                
                message = '✅ Paiement confirmé et certificat validé'
            elif status_paiement == 'failed':
                paiement.statut = 'ECHEC'
                paiement.save()
                message = '❌ Paiement échoué'
            else:
                paiement.statut = 'ANNULE'
                paiement.save()
                message = '⚠️ Paiement annulé'

            return Response({'message': message, 'status': status_paiement})
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post', 'get'])
    def paytech_callback(self, request):
        """Callback spécifique pour PayTech après succès du paiement"""
        print("🔔 Callback PayTech reçu")
        print(f"Method: {request.method}")
        print(f"GET params: {request.GET.dict()}")
        print(f"POST data: {request.data if request.method == 'POST' else 'N/A'}")
        
        # PayTech peut envoyer en GET ou POST
        if request.method == 'GET':
            ref_command = request.GET.get('ref_command') or request.GET.get('refCommand')
        else:
            ref_command = request.data.get('ref_command') or request.data.get('refCommand')
        
        if not ref_command:
            return Response({'error': 'ref_command manquant'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Extraire demande_id de ref_command (format: CERT_14_timestamp)
            parts = ref_command.split('_')
            if len(parts) < 2:
                return Response({'error': 'Format ref_command invalide'}, status=status.HTTP_400_BAD_REQUEST)
            
            demande_id = int(parts[1])
            
            # Trouver le paiement
            paiement = Paiement.objects.get(demande_id=demande_id)
            
            # Marquer comme effectué
            if paiement.statut != 'EFFECTUE':
                paiement.statut = 'EFFECTUE'
                paiement.reference_transaction = ref_command
                paiement.date_paiement = timezone.now()
                paiement.save()
                
                # Auto-valider la demande
                demande = paiement.demande
                if demande.statut != 'VALIDEE':
                    demande.statut = 'VALIDEE'
                    demande.save()
                    print(f"✅ Demande #{demande.id} auto-validée après callback PayTech")
            
            print(f"✅ Callback PayTech traité - Paiement #{paiement.id} confirmé")
            return Response({'success': True, 'message': 'Paiement confirmé'})
            
        except Paiement.DoesNotExist:
            print(f"❌ Paiement non trouvé pour demande #{demande_id}")
            return Response({'error': 'Paiement non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"❌ Erreur callback PayTech: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def verifier_paiement(self, request):
        """Vérifie l'état du paiement d'une demande"""
        demande_id = request.query_params.get('demande_id')

        if not demande_id:
            return Response({'error': 'demande_id est requis.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            paiement = Paiement.objects.get(demande_id=demande_id)
            
            # Si le paiement est en attente, vérifier auprès de PayTech
            if paiement.statut == 'EN_ATTENTE' and paiement.reference_transaction:
                print(f"🔍 Vérification PayTech pour ref: {paiement.reference_transaction}")
                paytech_status = paytech_check_status(paiement.reference_transaction)
                
                # Mettre à jour le statut selon la réponse PayTech
                if paytech_status.get('success') == 1:
                    paiement.statut = 'EFFECTUE'
                    paiement.date_paiement = timezone.now()
                    paiement.save()
                    
                    # Auto-valider la demande
                    demande = paiement.demande
                    if demande.statut != 'VALIDEE':
                        demande.statut = 'VALIDEE'
                        demande.save()
                        print(f"✅ Demande #{demande.id} auto-validée")
                    
                    print(f"✅ Paiement confirmé par PayTech")
            
            return Response({
                'paiement_effectue': paiement.statut == 'EFFECTUE',
                'statut': paiement.statut,
                'paiement': PaiementSerializer(paiement).data
            })
        except Paiement.DoesNotExist:
            return Response({
                'paiement_effectue': False,
                'message': 'Aucun paiement trouvé'
            })
