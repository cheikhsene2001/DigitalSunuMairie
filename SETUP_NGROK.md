# 🚀 Configuration ngrok pour PayTech (HTTPS local)

## Pourquoi ngrok ?
PayTech exige que l'URL IPN (webhook) soit en **HTTPS**. En développement local, votre serveur est en HTTP. ngrok crée un tunnel HTTPS vers votre serveur local.

---

## 📥 Installation ngrok

### Méthode 1 : Téléchargement direct
1. Aller sur https://ngrok.com/download
2. Créer un compte gratuit
3. Télécharger ngrok pour Windows
4. Extraire `ngrok.exe` dans un dossier (ex: `C:\ngrok\`)

### Méthode 2 : Avec Chocolatey (si installé)
```powershell
choco install ngrok
```

### Méthode 3 : Avec winget
```powershell
winget install --id=Ngrok.Ngrok -e
```

---

## 🔑 Configuration ngrok

1. **Obtenir votre token d'authentification** :
   - Connectez-vous sur https://dashboard.ngrok.com
   - Copiez votre authtoken

2. **Configurer le token** :
   ```powershell
   ngrok config add-authtoken VOTRE_TOKEN_ICI
   ```

---

## 🎯 Utilisation pour PayTech

### 1. Démarrer votre serveur Django
```powershell
cd backend
python manage.py runserver
```
*(Le serveur tourne sur http://127.0.0.1:8000)*

### 2. Dans un NOUVEAU terminal, lancer ngrok
```powershell
ngrok http 8000
```

### 3. Copier l'URL HTTPS
ngrok va afficher quelque chose comme :
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:8000
```

**Copiez l'URL HTTPS** (ex: `https://abc123.ngrok-free.app`)

### 4. Mettre à jour le fichier `.env`
```env
PAYTECH_IPN_URL=https://abc123.ngrok-free.app/api/paiements/webhook/
```

### 5. Redémarrer Django
```powershell
# Arrêter le serveur (Ctrl+C)
# Relancer
python manage.py runserver
```

---

## ✅ Vérification

1. **Tester que ngrok fonctionne** :
   - Ouvrir `https://abc123.ngrok-free.app/api/demandes/` dans un navigateur
   - Vous devriez voir votre API Django

2. **Tester un paiement** :
   - Le paiement devrait maintenant fonctionner
   - PayTech pourra envoyer les notifications à votre webhook

---

## 📝 Notes importantes

- ⚠️ L'URL ngrok **change à chaque redémarrage** (version gratuite)
- ⚠️ Il faut mettre à jour `.env` à chaque fois
- 💰 Pour une URL fixe : abonnement ngrok payant (~$8/mois)

### Alternative pour production :
En production, déployez sur un serveur avec HTTPS (Heroku, Railway, AWS, etc.)

---

## 🔄 Workflow de développement

**Terminal 1 - Django** :
```powershell
cd backend
python manage.py runserver
```

**Terminal 2 - ngrok** :
```powershell
ngrok http 8000
```

**Terminal 3 - Frontend** :
```powershell
cd frontend
npm start
```

---

## 🛠️ Débogage

### Voir les requêtes PayTech en temps réel
Ngrok fournit une interface web : http://127.0.0.1:4040

Vous y verrez toutes les requêtes HTTP/HTTPS qui passent par le tunnel.

---

## 🎁 Alternative temporaire (Tests seulement)

Si vous ne voulez pas configurer ngrok maintenant, le code actuel **désactive l'IPN**. 

⚠️ **Limitation** : Vous devrez marquer manuellement les paiements comme "EFFECTUE" dans la base de données, car PayTech ne pourra pas envoyer de confirmation automatique.

Pour marquer un paiement manuellement :
```python
# Dans le shell Django
python manage.py shell

from mairie_app.models import Paiement
p = Paiement.objects.get(id=X)  # Remplacer X par l'ID
p.statut = 'EFFECTUE'
p.save()
```
