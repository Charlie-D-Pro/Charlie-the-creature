import cv2
import numpy as np
import os

# Définir les chemins
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
image_path = os.path.join(desktop_path, "objects.png")
output_folder = os.path.join(desktop_path, "extracted_sprites")

# Charger l'image
image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)

# Vérifier si l'image est bien chargée
if image is None:
    print("❌ Erreur : Impossible de charger l'image. Vérifie son emplacement.")
    exit()

# Convertir en niveaux de gris
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Appliquer un seuillage pour détecter les objets
_, thresh = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)

# Trouver les contours des objets
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Créer un dossier de sortie sur le Bureau
os.makedirs(output_folder, exist_ok=True)

# Extraire chaque objet
for i, cnt in enumerate(contours):
    x, y, w, h = cv2.boundingRect(cnt)
    cropped = image[y:y+h, x:x+w]
    cv2.imwrite(os.path.join(output_folder, f"object_{i}.png"), cropped)

print(f"✅ Extraction terminée ! Les objets sont dans '{output_folder}'")
