from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):
    """
    Authentication backend que busca el access token en la cookie 'access_token'
    y, si no existe, cae en el comportamiento normal (Authorization header).
    """
    def authenticate(self, request):
        raw_token = request.COOKIES.get("access_token")
        if raw_token is None:
            # Fallback al header Authorization si existe
            return super().authenticate(request)

        validated_token = None
        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except Exception as exc:
            raise AuthenticationFailed("Token inválido o expirado") from exc