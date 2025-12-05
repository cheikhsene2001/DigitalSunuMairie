import os
import json
import logging

import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

API_URL = "https://paytech.sn/api/payment/request-payment"

API_KEY = os.getenv("PAYTECH_API_KEY")
API_SECRET = os.getenv("PAYTECH_API_SECRET")
PAYTECH_ENV = os.getenv("PAYTECH_ENV", "test")  # test ou prod
SUCCESS_URL = os.getenv("PAYTECH_SUCCESS_URL", "http://localhost:3000/paiement/success")
CANCEL_URL = os.getenv("PAYTECH_CANCEL_URL", "http://localhost:3000/paiement/cancel")
IPN_URL = os.getenv("PAYTECH_IPN_URL", "https://webhook.site/unique-url")

# Log pour vérifier les URLs chargées
logger.info(f"🔧 PayTech SUCCESS_URL chargée: {SUCCESS_URL}")
logger.info(f"🔧 PayTech CANCEL_URL chargée: {CANCEL_URL}")
logger.info(f"🔧 PayTech IPN_URL chargée: {IPN_URL}")


def request_payment(*, item_name: str, item_price: int, ref_command: str, command_name: str, custom_field: dict):
    """Crée une demande de paiement PayTech et retourne la réponse JSON.

    Retourne un dict avec au minimum {"success": bool, "message": str, ...}.
    """
    headers = {
        "API_KEY": API_KEY or "",
        "API_SECRET": API_SECRET or "",
        "Content-Type": "application/json",
    }

    # Beaucoup d'intégrations PayTech attendent des valeurs en chaînes
    # et certains noms de champs légèrement différents. On reste simple
    # et proche de la doc officielle.
    
    # Pour les tests locaux, utiliser une URL IPN factice mais valide
    # En production avec HTTPS, utiliser la vraie URL
    ipn_url = IPN_URL if IPN_URL and IPN_URL.startswith('https') else "https://webhook.site/unique-url"
    
    # S'assurer que les URLs ne sont pas None ou vides
    # Pour les tests, utiliser des URLs publiques valides que PayTech acceptera
    # Le callback success redirigera l'utilisateur ET notifiera le serveur
    success_url = "https://example.com/success"
    cancel_url = "https://example.com/cancel"
    # IPN URL pour webhook - PayTech l'appellera pour notifier le succès
    ipn_url = "https://webhook.site/unique-url"  # À remplacer par ngrok en prod
    
    payload = {
        "item_name": str(item_name),
        "item_price": str(item_price),
        "currency": "XOF",
        "ref_command": str(ref_command),
        "command_name": str(command_name),
        "env": PAYTECH_ENV or "test",
        "success_url": success_url,
        "cancel_url": cancel_url,
        "ipn_url": ipn_url,
        "channel": "MOBILE_MONEY",
        "custom_field": json.dumps(custom_field or {}),
    }
    
    logger.info("📤 PayTech - Paiement pour: %s", item_name)
    logger.info("📤 Référence: %s", ref_command)

    logger.info("📤 PayTech request_payment", extra={"payload": payload})

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        logger.info("📥 PayTech status %s", response.status_code)
        logger.debug("📥 PayTech body %s", response.text)

        try:
            data = response.json()
        except ValueError:
            logger.error("❌ Réponse PayTech non JSON: %s", response.text)
            return {"success": 0, "message": "Réponse PayTech invalide"}

        logger.info("📥 PayTech JSON %s", data)
        return data
    except requests.RequestException as exc:
        logger.error("❌ Erreur appel PayTech: %s", exc, exc_info=True)
        return {"success": 0, "message": "Erreur de connexion à PayTech"}
    except Exception as exc:  # pragma: no cover
        logger.error("❌ Erreur inattendue PayTech: %s", exc, exc_info=True)
        return {"success": 0, "message": "Erreur interne lors de l'initialisation du paiement"}


def check_payment_status(ref_command: str):
    """Vérifie le statut d'un paiement PayTech via sa référence.
    
    Retourne un dict avec {"success": bool, "status": str, "data": dict}.
    """
    # URL de vérification PayTech (à vérifier dans leur documentation)
    verify_url = "https://paytech.sn/api/payment/check"
    
    headers = {
        "API_KEY": API_KEY or "",
        "API_SECRET": API_SECRET or "",
        "Content-Type": "application/json",
    }
    
    payload = {
        "ref_command": str(ref_command),
    }
    
    logger.info("🔍 Vérification statut PayTech pour ref: %s", ref_command)
    
    try:
        response = requests.post(verify_url, headers=headers, json=payload, timeout=30)
        logger.info("📥 PayTech check status %s", response.status_code)
        
        try:
            data = response.json()
        except ValueError:
            logger.error("❌ Réponse PayTech check non JSON: %s", response.text)
            return {"success": False, "message": "Réponse PayTech invalide"}
        
        logger.info("📥 PayTech check data: %s", data)
        return data
    except requests.RequestException as exc:
        logger.error("❌ Erreur check PayTech: %s", exc, exc_info=True)
        return {"success": False, "message": "Erreur de connexion à PayTech"}
    except Exception as exc:
        logger.error("❌ Erreur inattendue check PayTech: %s", exc, exc_info=True)
        return {"success": False, "message": "Erreur interne lors de la vérification"}
