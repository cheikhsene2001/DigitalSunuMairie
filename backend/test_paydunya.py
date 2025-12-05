#!/usr/bin/env python
"""Test d'import et d'exécution de paydounya_utils"""

import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

print("=" * 60)
print("TEST IMPORT PAYDOUNYA_UTILS")
print("=" * 60)

try:
    print("\n1️⃣ Import du module...")
    from mairie_app.paydounya_utils import create_payment_invoice
    print("✅ Import réussi !")
    
    print("\n2️⃣ Test de la fonction create_payment_invoice...")
    result = create_payment_invoice(
        demande_id=14,
        montant=500,
        email="test@example.com",
        nom="Test",
        prenom="User"
    )
    
    print(f"\n📦 Résultat: {result}")
    
    if result.get('success'):
        print(f"✅ Succès ! URL: {result.get('url')}")
    else:
        print(f"❌ Erreur: {result.get('error')}")
        
except Exception as e:
    print(f"❌ ERREUR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
