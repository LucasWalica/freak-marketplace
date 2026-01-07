import os
import django
from django.core.asgi import get_asgi_application

# 1. Configurar la variable de entorno primero
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# 2. Inicializar la aplicación ASGI de Django (esto carga los modelos y apps)
django_asgi_app = get_asgi_application()

# 3. IMPORTAR el resto después de inicializar Django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
import chat.routing

application = ProtocolTypeRouter({
    # Usar la aplicación ya inicializada
    "http": django_asgi_app,
    
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                chat.routing.websocket_urlpatterns
            )
        )
    ),
})