# 🚀 Solution Rapide: Webhook PayTech sans ngrok

## Problème
PayTech exige une URL IPN en HTTPS. En local, vous avez HTTP.

## ✅ Solution Simple (Tests uniquement)

### Option 1: webhook.site (Le plus simple - Recommandé)

1. **Aller sur** : https://webhook.site
2. **Copier votre URL unique** (ex: `https://webhook.site/abc123-def456`)
3. **Mettre à jour `.env`** :
   ```env
   PAYTECH_IPN_URL=https://webhook.site/VOTRE_URL_ICI
   ```
4. **Redémarrer Django**

**Avantages** :
- ✅ Gratuit et instantané
- ✅ Interface web pour voir les requêtes en temps réel
- ✅ Pas d'installation

**Inconvénient** :
- ⚠️ Le webhook ne mettra pas à jour votre base de données (l'URL pointe vers webhook.site, pas votre serveur)

---

### Option 2: ngrok (Meilleure solution - URL vers votre serveur local)

#### Installation rapide

1. **Télécharger ngrok** :
   ```powershell
   # Avec winget
   winget install --id=Ngrok.Ngrok -e
   
   # OU télécharger depuis https://ngrok.com/download
   ```

2. **Créer un compte gratuit** : https://dashboard.ngrok.com/signup

3. **Configurer le token** :
   ```powershell
   ngrok config add-authtoken VOTRE_TOKEN
   ```

#### Utilisation

**Terminal 1 - Django** :
```powershell
cd backend
python manage.py runserver
```

**Terminal 2 - ngrok** :
```powershell
ngrok http 8000
```

**Copier l'URL HTTPS** (ex: `https://abc123.ngrok-free.app`)

**Mettre à jour `.env`** :
```env
PAYTECH_IPN_URL=https://abc123.ngrok-free.app/api/paiements/webhook/
```

**Redémarrer Django** (Ctrl+C puis `python manage.py runserver`)

**Avantages** :
- ✅ Les webhooks mettent à jour votre base de données
- ✅ Simulation parfaite de la production
- ✅ Interface web pour debug : http://127.0.0.1:4040

**Inconvénients** :
- ⚠️ URL change à chaque redémarrage (version gratuite)
- ⚠️ Nécessite un compte

---

## 🎯 Pour tester MAINTENANT (sans configuration)

Le code actuel utilise automatiquement `https://webhook.site/unique-url` comme URL IPN factice.

**Ce qui se passe** :
- ✅ Le paiement PayTech fonctionne
- ✅ Vous pouvez payer
- ⚠️ Le statut reste "EN_ATTENTE" car webhook.site ne renvoie rien à votre serveur

**Pour voir le statut** :
1. Retournez au dashboard citoyen
2. Le système vérifie automatiquement le statut auprès de PayTech
3. Si le paiement est réussi, le statut se met à jour

---

## 📊 Comparaison des solutions

| Solution | Configuration | Temps | Auto-update DB | Recommandé pour |
|----------|---------------|-------|----------------|-----------------|
| **webhook.site** | 2 minutes | Immédiat | ❌ Non | Tests rapides |
| **ngrok** | 10 minutes | 30 secondes | ✅ Oui | Développement complet |
| **Code actuel** | 0 | Immédiat | ❌ Non | Test immédiat |
| **Production** | Variable | - | ✅ Oui | Déploiement final |

---

## 🔄 Workflow recommandé

### Pour tester rapidement (maintenant) :
1. Ne rien changer
2. Testez le paiement
3. Le statut se met à jour quand vous retournez au dashboard

### Pour développer sérieusement :
1. Installer ngrok (une fois)
2. Lancer ngrok avant chaque session
3. Copier l'URL dans `.env`
4. Redémarrer Django

### Pour la production :
1. Déployer sur Heroku/Railway/AWS
2. URL automatiquement en HTTPS
3. Mettre l'URL réelle dans `.env` de production

---

## 🆘 Aide rapide

**Si le paiement ne fonctionne toujours pas** :
```bash
cd backend
python manage.py shell
```

```python
from mairie_app.models import Paiement
# Voir tous les paiements
Paiement.objects.all().values()

# Marquer un paiement comme effectué (pour tests)
p = Paiement.objects.get(id=2)  # Remplacer 2 par l'ID du paiement
p.statut = 'EFFECTUE'
p.save()
```

---

## ✅ Action recommandée MAINTENANT

**Essayez de refaire un paiement** - ça devrait fonctionner avec l'URL IPN factice !

Le message d'erreur "IPN URL manquant" ne devrait plus apparaître.
