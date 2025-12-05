"""
Utilitaires pour intégration PayDunya
Implémentation avec l'API officielle (création d'invoice)
"""

import os
import requests
import logging
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

logger = logging.getLogger(__name__)

# Configuration PayDunya
USE_SANDBOX = os.getenv("PAYDOUNYA_USE_SANDBOX", "True").lower() == "true"
USE_SIMULATION = False  # FORCE: Désactivé pour utiliser vraies credentials
# USE_SIMULATION = os.getenv("PAYDOUNYA_USE_SIMULATION", "False").lower() == "true"
PAYDOUNYA_BASE_URL = "https://app.paydunya.com"
PAYDOUNYA_API_URL = f"{PAYDOUNYA_BASE_URL}/sandbox-api/v1" if USE_SANDBOX else f"{PAYDOUNYA_BASE_URL}/api/v1"

MASTER_KEY = os.getenv("PAYDOUNYA_MASTER_KEY")
PRIVATE_KEY = os.getenv("PAYDOUNYA_PRIVATE_KEY")
PUBLIC_KEY = os.getenv("PAYDOUNYA_PUBLIC_KEY")
TOKEN = os.getenv("PAYDOUNYA_TOKEN")
RETURN_URL = os.getenv("RETURN_URL_FRONTEND", "http://localhost:3001/citoyen/dashboard")

logger.info(f"🔧 PayDunya Mode: {'SIMULATION' if USE_SIMULATION else ('SANDBOX' if USE_SANDBOX else 'PRODUCTION')}")
logger.info(f"🔧 PayDunya API URL: {PAYDOUNYA_API_URL}")


def create_payment_invoice(demande_id, montant, email, nom, prenom):
    """
    Crée une facture de paiement via l'API PayDunya officielle
    
    Args:
        demande_id: ID de la demande de certificat
        montant: Montant en FCFA
        email: Email du citoyen
        nom: Nom du citoyen
        prenom: Prénom du citoyen
    
    Returns:
        dict avec 'success', 'url' (si succès), 'error' (si échec)
    """
    
    # MODE SIMULATION - Pour tester sans vraies credentials
    if USE_SIMULATION:
        import random
        import string
        token = 'sim_' + ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        checkout_url = f"{PAYDOUNYA_BASE_URL}/sandbox-checkout/invoice/{token}"
        
        logger.info(f"🎭 MODE SIMULATION - Invoice simulée créée")
        logger.info(f"🔗 URL simulée: {checkout_url}")
        
        return {
            "success": True,
            "url": checkout_url,
            "token": token,
            "response_text": "✅ Paiement simulé (Mode Test)"
        }
    
    try:
        # Headers requis par PayDunya
        headers = {
            "PAYDUNYA-MASTER-KEY": MASTER_KEY,
            "PAYDUNYA-PRIVATE-KEY": PRIVATE_KEY,
            "PAYDUNYA-TOKEN": TOKEN,
            "Content-Type": "application/json"
        }
        
        # Corps de la requête selon documentation PayDunya
        payload = {
            "invoice": {
                "total_amount": int(montant),
                "description": f"Certificat - Demande #{demande_id}"
            },
            "store": {
                "name": "DigitalSunuMairie",
                "website": "http://localhost:3001"
            },
            "actions": {
                "cancel_url": RETURN_URL,
                "return_url": RETURN_URL
            },
            "custom_data": {
                "demande_id": str(demande_id),
                "nom_complet": f"{prenom} {nom}"
            }
        }
        
        logger.info(f"📤 Création invoice PayDunya - Demande #{demande_id} - Montant: {montant} FCFA")
        logger.debug(f"Headers: {headers}")
        logger.debug(f"Payload: {payload}")
        
        # Appel API PayDunya
        response = requests.post(
            f"{PAYDOUNYA_API_URL}/checkout-invoice/create",
            json=payload,
            headers=headers,
            timeout=30
        )
        
        logger.info(f"📥 Réponse PayDunya - Status: {response.status_code}")
        logger.debug(f"Response body: {response.text}")
        
        # Traiter la réponse
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            
            if data.get("response_code") == "00":
                # Succès - Construire l'URL de checkout
                token = data.get("token")
                checkout_url = f"{PAYDOUNYA_BASE_URL}/checkout/{token}"
                
                logger.info(f"✅ Invoice créée avec succès - Token: {token}")
                logger.info(f"🔗 URL de paiement: {checkout_url}")
                
                return {
                    "success": True,
                    "url": checkout_url,
                    "token": token,
                    "response_text": data.get("response_text", "Paiement initialisé")
                }
            else:
                # Erreur retournée par PayDunya
                error_msg = data.get("response_text", "Erreur inconnue de PayDunya")
                logger.error(f"❌ Erreur PayDunya: {error_msg} (Code: {data.get('response_code')})")
                
                return {
                    "success": False,
                    "error": error_msg
                }
        else:
            # Erreur HTTP
            logger.error(f"❌ Erreur HTTP {response.status_code}: {response.text}")
            return {
                "success": False,
                "error": f"Erreur de communication avec PayDunya (HTTP {response.status_code})"
            }
            
    except requests.exceptions.Timeout:
        logger.error("❌ Timeout lors de l'appel API PayDunya")
        return {
            "success": False,
            "error": "Le serveur de paiement ne répond pas. Veuillez réessayer."
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Erreur réseau: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": "Erreur de connexion au service de paiement"
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur inattendue: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": "Une erreur est survenue lors de l'initialisation du paiement"
        }


def verify_payment_status(token):
    """
    Vérifie le statut d'un paiement via son token
    
    Args:
        token: Token de l'invoice PayDunya
    
    Returns:
        dict avec les informations du paiement
    """
    
    try:
        headers = {
            "PAYDUNYA-MASTER-KEY": MASTER_KEY,
            "PAYDUNYA-PRIVATE-KEY": PRIVATE_KEY,
            "PAYDUNYA-TOKEN": TOKEN
        }
        
        response = requests.get(
            f"{PAYDOUNYA_API_URL}/checkout-invoice/confirm/{token}",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"✅ Statut paiement récupéré pour token {token}")
            return {
                "success": True,
                "data": data
            }
        else:
            logger.error(f"❌ Erreur vérification paiement: {response.status_code}")
            return {
                "success": False,
                "error": "Impossible de vérifier le paiement"
            }
            
    except Exception as e:
        logger.error(f"❌ Erreur vérification: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": str(e)
        }

