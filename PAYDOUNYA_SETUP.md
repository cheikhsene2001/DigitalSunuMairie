# 🎯 Guide Complet: Configuration Paydounya pour DigitalSunuMairie

## 📋 Table des matières
1. [Créer un compte Paydounya](#créer-un-compte-paydounya)
2. [Obtenir tes credentials](#obtenir-tes-credentials)
3. [Configurer ton application](#configurer-ton-application)
4. [Tester l'intégration](#tester-lintégration)
5. [Passer en production](#passer-en-production)

---

## 1️⃣ Créer un compte Paydounya

### Étape 1: Aller sur le site Paydounya
- **URL**: https://www.paydounya.com
- Clique sur **"S'inscrire"** ou **"Sign Up"**

### Étape 2: Remplir le formulaire d'inscription
Tu dois fournir:
- **Email**: Ton email professionnel
- **Mot de passe**: Sécurisé (min 8 caractères)
- **Numéro de téléphone**: +221XXXXXXXXX (pour le Sénégal)
- **Entreprise/Commerce**: Nom de ta mairie ou service
- **Type d'activité**: Services administratifs / Gouvernement

### Étape 3: Vérifier ton email
- Paydounya t'envoie un email de confirmation
- Clique sur le lien de confirmation
- Ton compte est activé!

---

## 2️⃣ Obtenir tes Credentials

### Dans ton Tableau de Bord Paydounya:

1. **Connecte-toi** à https://www.paydounya.com/dashboard

2. **Va dans "Paramètres" ou "Settings"**
   - Menu principal → Paramètres/Settings

3. **Trouve la section "API"** ou **"Clés API"**
   - Tu verras:
     - 🔑 **API Key** (ex: `pk_live_xxx...`)
     - 🎫 **Token** (ex: `tk_live_xxx...`)
     - 🏪 **Merchant ID** (ex: `app_xxx...`)

4. **Copie ces 3 informations** (tu les utiliseras bientôt)

### Important: Environment (Sandbox vs Live)
- **Sandbox/Test**: Pour tester AVANT de lancer
  - URL: https://app.paydounya.com/sandbox-payment
  - Credentials: Demande à Paydounya les clés test
- **Production/Live**: Pour les vrais paiements
  - URL: https://app.paydounya.com/payment
  - Credentials: Celles que tu as copiées

---

## 3️⃣ Configurer ton Application

### Étape 1: Créer le fichier `.env`

Crée un fichier `.env` **à la racine du dossier `/backend`**:

```bash
# File: backend/.env

# ========== PAYDOUNYA CONFIGURATION ==========
PAYDOUNYA_API_KEY=pk_live_votre_api_key_ici
PAYDOUNYA_TOKEN=tk_live_votre_token_ici
PAYDOUNYA_MERCHANT_ID=app_votre_merchant_id_ici

# Mode Test ou Production
PAYDOUNYA_USE_SANDBOX=False  # Mettre à True pour tester

# Webhook (URL où Paydounya envoie les notifications)
PAYDOUNYA_WEBHOOK_URL=http://127.0.0.1:8000/api/paiements/webhook-paydounya/
```

### Étape 2: Remplacer les valeurs
Remplace:
- `votre_api_key_ici` → Colle la vraie API Key
- `votre_token_ici` → Colle le vrai Token
- `votre_merchant_id_ici` → Colle le vrai Merchant ID

### Étape 3: Mettre à jour `paydounya_utils.py`

Le fichier `backend/mairie_app/paydounya_utils.py` lit automatiquement du `.env`.

Vérifie qu'il contient:

```python
import os
from dotenv import load_dotenv

load_dotenv()

PAYDOUNYA_API_KEY = os.getenv('PAYDOUNYA_API_KEY', 'demo_api_key')
PAYDOUNYA_TOKEN = os.getenv('PAYDOUNYA_TOKEN', 'demo_token')
PAYDOUNYA_MERCHANT_ID = os.getenv('PAYDOUNYA_MERCHANT_ID', 'demo_merchant')
PAYDOUNYA_USE_SANDBOX = os.getenv('PAYDOUNYA_USE_SANDBOX', 'True').lower() == 'true'

PAYDOUNYA_SANDBOX_URL = "https://app.paydounya.com/sandbox-payment"
PAYDOUNYA_LIVE_URL = "https://app.paydounya.com/payment"
PAYDOUNYA_BASE_URL = PAYDOUNYA_SANDBOX_URL if PAYDOUNYA_USE_SANDBOX else PAYDOUNYA_LIVE_URL
```

---

## 4️⃣ Tester l'Intégration

### Pour tester SANS débourser d'argent:

1. **Mets `PAYDOUNYA_USE_SANDBOX=True`** dans `.env`

2. **Demande à Paydounya les credentials SANDBOX**
   - Contact: support@paydounya.com
   - Ou regarde sur leur dashboard (section Test/Sandbox)

3. **Utilise des numéros de test**:
   ```
   Carte test: 4111 1111 1111 1111
   Exp: 12/25
   CVV: 123
   ```

4. **Effectue un paiement de test**
   - Va dans l'app: Demandes → Certificats → Payer (500 FCFA test)
   - Tu seras redirigé vers Paydounya Sandbox
   - Utilise les numéros de test ci-dessus
   - Le paiement sera confirmé

### Vérifier que ça marche:
- ✅ Tu es redirigé vers Paydounya
- ✅ Le paiement est marqué comme "EFFECTUE" dans ton app
- ✅ Tu peux télécharger le certificat PDF

---

## 5️⃣ Passer en Production

### Quand tu es prêt pour les VRAIS paiements:

1. **Change la configuration `.env`**:
   ```bash
   PAYDOUNYA_USE_SANDBOX=False  # ✅ Production mode ON
   ```

2. **Assure-toi d'avoir les credentials LIVE**:
   - Pas les credentials SANDBOX
   - Les credentials LIVE commencent par `pk_live_`, `tk_live_`, etc.

3. **Configure le Webhook URL en production**
   - Dans ton dashboard Paydounya → Webhooks
   - Ajoute: `https://tondomaine.com/api/paiements/webhook-paydounya/`
   - (Remplace `tondomaine.com` par ton vrai domaine)

4. **Teste avec un petit montant d'abord**
   - 500 FCFA c'est parfait pour tester

5. **Vérifiez que tout fonctionne**
   - L'argent arrive bien sur ton compte Paydounya
   - Les paiements sont enregistrés en base de données

---

## 🔐 Sécurité - IMPORTANT!

### ⚠️ Ne jamais:
- ❌ Committer `.env` sur Git
- ❌ Partager tes credentials
- ❌ Mettre les credentials en dur dans le code
- ❌ Uploader `.env` sur ton serveur public

### ✅ À faire:
- ✅ Ajouter `.env` à `.gitignore`
- ✅ Utiliser un gestionnaire de secrets en production (AWS Secrets Manager, etc.)
- ✅ Régulièrement régénérer tes API keys
- ✅ Utiliser une adresse email de notification sécurisée

---

## 📞 Contacter Paydounya

Si tu as des problèmes:
- **Email**: support@paydounya.com
- **Site**: https://www.paydounya.com
- **FAQ**: https://www.paydounya.com/faq

---

## ✅ Checklist Finale

- [ ] Compte Paydounya créé
- [ ] API Key, Token, Merchant ID copiés
- [ ] Fichier `.env` créé avec les credentials
- [ ] `PAYDOUNYA_USE_SANDBOX=True` (pour tester)
- [ ] Backend redémarré (`python manage.py runserver`)
- [ ] Teste un paiement de 500 FCFA
- [ ] Paiement s'affiche comme "EFFECTUE"
- [ ] PDF certificat peut être téléchargé
- [ ] Change à `PAYDOUNYA_USE_SANDBOX=False` quand prêt pour production

---

## 🎉 Prêt!

Ton intégration Paydounya est maintenant opérationnelle!

Les utilisateurs peuvent:
1. ✅ Créer une demande de certificat
2. ✅ Attendre la validation par la mairie
3. ✅ Payer 500 FCFA via Paydounya
4. ✅ Télécharger le certificat PDF

Bonne chance! 🚀
