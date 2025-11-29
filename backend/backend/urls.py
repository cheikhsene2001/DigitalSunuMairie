from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from mairie_app.views import MairieViewSet



router = routers.DefaultRouter()
router.register(r'mairies', MairieViewSet)

urlpatterns = [
    path('api/', include('mairie_app.urls')),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # ✅ API activée ici
    
]
