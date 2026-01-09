# Guía de Testing - Freak Marketplace

## 🧪 Pruebas Funcionales

### 1. Flujo de Registro
1. **Acceder**: `http://localhost:4200/auth/register`
2. **Validaciones Frontend**:
   - [ ] Username: menos de 3 chars → error
   - [ ] Username: más de 20 chars → error  
   - [ ] Username: caracteres especiales → error
   - [ ] Email: formato inválido → error
   - [ ] Password: menos de 8 chars → error
   - [ ] Password: sin mayúscula → error
   - [ ] Password: sin número → error
   - [ ] Password2: no coincide → error
3. **Registro Exitoso**:
   - [ ] Datos válidos → mensaje de éxito
   - [ ] Redirección a login después de 2s
4. **Backend Validation**:
   - [ ] Username duplicado → error específico
   - [ ] Email duplicado → error específico

### 2. Flujo de Login
1. **Acceder**: `http://localhost:4200/auth/login`
2. **Validaciones**:
   - [ ] Campos vacíos → error
   - [ ] Credenciales incorrectas → error
3. **Login con Username**:
   - [ ] Username + password correctos → login exitoso
4. **Login con Email**:
   - [ ] Email + password correctos → login exitoso
5. **Post-Login**:
   - [ ] Cookie JWT establecida
   - [ ] Redirección a dashboard
   - [ ] Estado de autenticación actualizado

### 3. Gestión de Perfil
1. **Acceder**: `http://localhost:4200/profile/me`
2. **Carga de Datos**:
   - [ ] Información de usuario cargada
   - [ ] Datos del perfil cargados
3. **Edición de Perfil**:
   - [ ] Bio: más de 500 chars → error
   - [ ] Avatar URL: inválida → error
   - [ ] Actualización exitosa → mensaje de éxito
4. **Persistencia**:
   - [ ] Cambios guardados en backend
   - [ ] Vista actualizada sin recargar

## 🔧 Pruebas Técnicas

### CORS y Cookies
```bash
# Verificar que las cookies se envíen
# En Chrome DevTools → Application → Cookies
# Debe aparecer: access_token
```

### Endpoints Backend
```bash
# Registro
POST http://localhost:80/api/users/register/
Content-Type: application/json
{
  "username": "testuser",
  "email": "test@example.com", 
  "password": "Test1234",
  "password2": "Test1234",
  "first_name": "Test",
  "last_name": "User"
}

# Login  
POST http://localhost:80/api/users/login/
Content-Type: application/json
{
  "username": "testuser",
  "password": "Test1234"
}

# Perfil
GET http://localhost:80/api/users/profile/me/
Cookie: access_token=...

PATCH http://localhost:80/api/users/profile/me/
Content-Type: application/json
{
  "bio": "Nueva biografía",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### Errores Comunes y Soluciones

#### 401 Unauthorized
- **Causa**: Cookie no enviada o inválida
- **Solución**: Verificar `withCredentials: true` en interceptor
- **Verificación**: DevTools → Network → Headers → Cookie

#### 400 Bad Request  
- **Causa**: Validaciones del backend
- **Solución**: Revisar serializadores y validaciones
- **Verificación**: Console del navegador para errores específicos

#### CORS Errors
- **Causa**: Origen no permitido
- **Solución**: Verificar configuración en `settings.py`
- **Verificación**: DevTools → Console → CORS errors

## 🚀 Checklist de Producción

### Frontend
- [ ] Todos los formularios usan ReactiveForms
- [ ] Validadores personalizados implementados
- [ ] Mensajes de error en español
- [ ] Estados de carga visuales
- [ ] Manejo de errores de red
- [ ] Redirecciones correctas

### Backend  
- [ ] Serializadores con validaciones proper
- [ ] Vistas con manejo de errores
- [ ] CORS configurado para producción
- [ ] JWT cookies funcionando
- [ ] Signals para creación automática de perfiles

### Seguridad
- [ ] Contraseñas con validación fuerte
- [ ] Tokens con expiración adecuada
- [ ] HTTPS en producción
- [ ] CSRF protection activada

## 📱 Pruebas Mobile

### Responsive Design
- [ ] Formularios usables en móvil
- [ ] Botones táctiles adecuados
- [ ] Mensajes de error visibles
- [ ] Sin horizontal scroll

### Touch Interactions
- [ ] Validación en tiempo real
- [ ] Feedback visual inmediato
- [ ] Teclado numérico funcional
- [ ] Zoom de página funcionando

## 🔍 Debugging Tips

### Frontend
```typescript
// Habilitar debug de forms
this.registerForm.valueChanges.subscribe(value => {
  console.log('Form value:', value);
  console.log('Form valid:', this.registerForm.valid);
  console.log('Form errors:', this.registerForm.errors);
});
```

### Backend
```python
# Verificar logs de Django
python manage.py runserver --settings=core.settings

# Revisar migraciones
python manage.py showmigrations
python manage.py migrate
```

### Network
```bash
# Verificar requests
# DevTools → Network → XHR/Fetch
# Revisar: Status, Headers, Response
```

## ✅ Success Criteria

La aplicación está lista para producción cuando:

1. **Registro**: Funciona con validaciones frontend y backend
2. **Login**: Funciona con username/email y cookies JWT
3. **Perfil**: Carga, edita y guarda correctamente
4. **Errores**: Todos los errores se muestran claramente
5. **UX**: La aplicación es responsiva y usables
6. **Seguridad**: Las validaciones son robustas
