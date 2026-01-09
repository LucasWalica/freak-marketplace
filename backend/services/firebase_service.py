import os
import uuid
import firebase_admin
from firebase_admin import storage, credentials
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
import io
from typing import List, Optional


class FirebaseStorageService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseStorageService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        # Usamos el nombre exacto definido en settings.py
        # Usamos getattr por seguridad, por si acaso el bucket es None
        self.bucket = getattr(settings, 'FIREBASE_BUCKET', None)
        
    def _initialize_firebase(self):
        if not firebase_admin._apps:
            try:
                # Ahora leemos directamente del diccionario en settings
                cred = credentials.Certificate(settings.FIREBASE_CONFIG)
                firebase_admin.initialize_app(cred, {
                    'storageBucket': settings.FIREBASE_STORAGE_BUCKET
                })
                self.bucket = storage.bucket()
                print("Firebase Storage initialized successfully")
            except Exception as e:
                print(f"Error initializing Firebase Storage: {e}")
                self.bucket = None
    
    def _optimize_image(self, image_file: InMemoryUploadedFile, max_size: int = 800, quality: int = 85) -> bytes:
        """Optimizar imagen para reducir tamaño"""
        try:
            img = Image.open(image_file)
            
            # Convertir a RGB si es necesario
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Redimensionar manteniendo aspecto
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            # Optimizar y convertir a bytes
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG', quality=quality, optimize=True)
            img_io.seek(0)
            
            return img_io.getvalue()
        except Exception as e:
            print(f"Error optimizing image: {e}")
            return image_file.read()
    
    def _generate_filename(self, original_filename: str, folder: str = 'products') -> str:
        """Generar nombre de archivo único"""
        ext = original_filename.split('.')[-1].lower()
        if ext not in ['jpg', 'jpeg', 'png', 'webp']:
            ext = 'jpg'
        
        unique_id = str(uuid.uuid4())
        return f"{folder}/{unique_id}.{ext}"
    
    def upload_image(self, image_file: InMemoryUploadedFile, folder: str = 'products', optimize: bool = True) -> Optional[str]:
        """
        Subir una imagen a Firebase Storage
        
        Args:
            image_file: Archivo de imagen
            folder: Carpeta de destino (default: 'products')
            optimize: Si se debe optimizar la imagen
            
        Returns:
            URL pública de la imagen o None si hay error
        """
        if not self.bucket:
            print("Firebase Storage not initialized")
            return None
        
        try:
            # Validar tipo de archivo
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if image_file.content_type not in allowed_types:
                print(f"Invalid file type: {image_file.content_type}")
                return None
            
            # Validar tamaño (máximo 10MB)
            if image_file.size > 10 * 1024 * 1024:
                print("File too large (max 10MB)")
                return None
            
            # Optimizar imagen si se solicita
            if optimize:
                file_data = self._optimize_image(image_file)
            else:
                image_file.seek(0)
                file_data = image_file.read()
            
            # Generar nombre único
            filename = self._generate_filename(image_file.name, folder)
            
            # Subir a Firebase Storage
            blob = self.bucket.blob(filename)
            blob.upload_from_string(
                file_data,
                content_type=image_file.content_type
            )
            
            # Hacer público
            blob.make_public()
            
            print(f"Image uploaded successfully: {blob.public_url}")
            return blob.public_url
            
        except Exception as e:
            print(f"Error uploading image: {e}")
            return None
    
    def upload_multiple_images(self, image_files: List[InMemoryUploadedFile], folder: str = 'products') -> List[str]:
        """
        Subir múltiples imágenes a Firebase Storage
        
        Args:
            image_files: Lista de archivos de imagen
            folder: Carpeta de destino
            
        Returns:
            Lista de URLs públicas de las imágenes subidas
        """
        urls = []
        max_images = 10  # Límite de imágenes por producto
        
        for i, image_file in enumerate(image_files[:max_images]):
            url = self.upload_image(image_file, folder)
            if url:
                urls.append(url)
        
        return urls
    
    def delete_image(self, image_url: str) -> bool:
        """
        Eliminar una imagen de Firebase Storage
        
        Args:
            image_url: URL pública de la imagen
            
        Returns:
            True si se eliminó correctamente, False si no
        """
        if not self.bucket:
            return False
        
        try:
            # Extraer el nombre del archivo de la URL
            # URL format: https://storage.googleapis.com/bucket-name/folder/filename.ext
            if 'storage.googleapis.com' in image_url:
                filename = image_url.split('/')[-1]
                # Si hay carpeta, incluirla
                path_parts = image_url.split('/')
                if 'products' in path_parts:
                    products_index = path_parts.index('products')
                    filename = '/'.join(path_parts[products_index:])
                
                blob = self.bucket.blob(filename)
                blob.delete()
                print(f"Image deleted successfully: {filename}")
                return True
            else:
                print(f"Invalid Firebase Storage URL: {image_url}")
                return False
                
        except Exception as e:
            print(f"Error deleting image: {e}")
            return False
    
    def get_image_info(self, image_url: str) -> Optional[dict]:
        """
        Obtener información de una imagen en Firebase Storage
        
        Args:
            image_url: URL pública de la imagen
            
        Returns:
            Diccionario con información del archivo o None si hay error
        """
        if not self.bucket:
            return None
        
        try:
            if 'storage.googleapis.com' in image_url:
                path_parts = image_url.split('/')
                if 'products' in path_parts:
                    products_index = path_parts.index('products')
                    filename = '/'.join(path_parts[products_index:])
                else:
                    filename = image_url.split('/')[-1]
                
                blob = self.bucket.blob(filename)
                blob.reload()  # Obtener información actualizada
                
                return {
                    'name': blob.name,
                    'size': blob.size,
                    'content_type': blob.content_type,
                    'updated': blob.updated,
                    'md5_hash': blob.md5_hash
                }
            else:
                return None
                
        except Exception as e:
            print(f"Error getting image info: {e}")
            return None
