#!/bin/bash

# --- CONFIGURATION ---
APP_NAME="MSPR"
JAR_PATH="C:/epsi/MSPR/MSPR/back/target/back-0.0.1-SNAPSHOT.jar"
LOG_DIR="/var/log/mspr"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="$LOG_DIR/ingestion_$TIMESTAMP.log"

# Création du dossier de logs si inexistant (nécessite les droits admin)
# Si ça bloque, utilise un dossier dans ton Home : LOG_DIR="/Users/ton-nom/logs/mspr"
mkdir -p $LOG_DIR

echo "----------------------------------------------------------" >> $LOG_FILE
echo "[$TIMESTAMP] INFO: Lancement du pipeline mensuel..." >> $LOG_FILE

# --- EXÉCUTION ---
# On lance le fichier JAR
java -jar "$JAR_PATH" --spring.profiles.active=ingestion >> "$LOG_FILE" 2>&1

# --- GESTION DES ERREURS ---
if [ $? -eq 0 ]; then
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] SUCCESS: Ingestion et calculs terminés." >> "$LOG_FILE"
else
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] ERROR: Échec critique du pipeline. Vérifier les logs." >> "$LOG_FILE"
    exit 1
fi

# --- CONFIGURATION CRON ---
# À ajouter via 'crontab -e' :
# 0 0 1 * * /bin/bash /Users/ton-nom/Documents/MSPR/scripts/deploy-automation.sh