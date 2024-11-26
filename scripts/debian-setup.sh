#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    print_error "Este script debe ejecutarse como root"
    exit 1
fi

# Actualizar el sistema
print_message "Actualizando el sistema..."
apt update && apt upgrade -y

# Instalar dependencias necesarias
print_message "Instalando dependencias..."
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    ufw

# Configurar firewall
print_message "Configurando firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Instalar Docker
print_message "Instalando Docker..."
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Iniciar y habilitar Docker
print_message "Configurando Docker..."
systemctl start docker
systemctl enable docker

# Crear directorios de la aplicación
print_message "Creando directorios de la aplicación..."
mkdir -p /opt/necesidades-docentes/server/{database,uploads}
chmod 755 /opt/necesidades-docentes/server/{database,uploads}

# Configurar límites de sistema
print_message "Configurando límites del sistema..."
cat >> /etc/sysctl.conf << EOF
# Aumentar límites para la aplicación
fs.file-max = 100000
vm.max_map_count = 262144
EOF

sysctl -p

# Mensaje final
print_message "Configuración completada. Por favor:"
echo "1. Copie los archivos de la aplicación a /opt/necesidades-docentes"
echo "2. Configure el archivo .env con sus variables de entorno"
echo "3. Ejecute 'docker compose up -d' para iniciar la aplicación"