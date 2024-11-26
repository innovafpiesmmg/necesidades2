# Gestión de Proyectos por Necesidades Docentes

Sistema de gestión de proyectos educativos que permite a los docentes presentar, gestionar y dar seguimiento a sus proyectos de innovación educativa.

## Características

- 🔐 Sistema de autenticación y autorización
- 👥 Gestión de usuarios con roles (Administrador, Director, Profesor)
- 📊 Panel de control con métricas y estadísticas
- 📝 Gestión completa de proyectos educativos
- 📅 Sistema de períodos académicos
- 📊 Informes periódicos y seguimiento
- 📱 Notificaciones por WhatsApp
- 🎨 Interfaz moderna y responsive
- 🔒 Seguridad y validación de datos
- 📁 Almacenamiento de archivos
- 🗄️ Base de datos SQLite

## Requisitos del Sistema

- Debian 11 o superior
- Docker 24.0 o superior
- Docker Compose 2.0 o superior
- 2GB RAM mínimo
- 10GB espacio en disco

## Instalación en Debian

### 1. Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Instalar dependencias necesarias

```bash
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

### 3. Instalar Docker

```bash
# Añadir la clave GPG oficial de Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Añadir el repositorio de Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 4. Configurar Docker

```bash
# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Añadir usuario al grupo docker
sudo usermod -aG docker $USER
```

### 5. Clonar y configurar el proyecto

```bash
# Crear directorio para la aplicación
mkdir -p /opt/necesidades-docentes
cd /opt/necesidades-docentes

# Copiar archivos del proyecto
# (Asegúrate de copiar todos los archivos del proyecto a este directorio)

# Crear directorios necesarios
mkdir -p server/database server/uploads
chmod 755 server/database server/uploads
```

### 6. Configurar variables de entorno

Crea un archivo `.env` en el directorio raíz:

```bash
# Configuración del servidor
NODE_ENV=production
PORT=3000
JWT_SECRET=tu-secreto-seguro
FRONTEND_URL=http://tu-dominio.com

# Configuración de Twilio (opcional)
TWILIO_ACCOUNT_SID=tu-sid
TWILIO_AUTH_TOKEN=tu-token
TWILIO_WHATSAPP_NUMBER=tu-numero
```

## Despliegue

### 1. Construir y ejecutar con Docker Compose

```bash
# Construir las imágenes
docker compose build

# Iniciar los servicios
docker compose up -d
```

### 2. Verificar el despliegue

```bash
# Verificar que los contenedores están ejecutándose
docker compose ps

# Ver logs
docker compose logs -f
```

## Acceso a la aplicación

- URL: `http://tu-dominio` o `http://ip-del-servidor`
- Credenciales por defecto:
  - Email: admin@example.com
  - Contraseña: admin123

## Mantenimiento

### Actualizar la aplicación

```bash
# Detener los contenedores
docker compose down

# Obtener últimos cambios
git pull

# Reconstruir y reiniciar
docker compose build
docker compose up -d
```

### Backup de la base de datos

```bash
# Crear backup
cp server/database/database.sqlite server/database/backup-$(date +%Y%m%d).sqlite
```

### Monitoreo

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver estadísticas de recursos
docker stats
```

## Solución de problemas

### Verificar estado del servicio

```bash
# Estado del contenedor
docker compose ps

# Logs detallados
docker compose logs -f app
```

### Problemas comunes

1. **Error de permisos en la base de datos**
   ```bash
   sudo chown -R 1000:1000 server/database
   sudo chmod 755 server/database
   ```

2. **Error de conexión al puerto 80**
   ```bash
   # Verificar si el puerto está en uso
   sudo netstat -tulpn | grep 80
   ```

3. **Reiniciar el servicio**
   ```bash
   docker compose restart
   ```

## Seguridad

- Mantén el sistema operativo y Docker actualizados
- Cambia las credenciales por defecto inmediatamente
- Configura un firewall (UFW recomendado)
- Usa HTTPS en producción
- Realiza backups regulares

## Soporte

Para reportar problemas o solicitar ayuda:
1. Abre un issue en el repositorio
2. Describe el problema detalladamente
3. Incluye logs relevantes
4. Menciona la versión de Debian y Docker

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.