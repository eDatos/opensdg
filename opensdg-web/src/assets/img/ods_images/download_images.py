"""
Script que descarga las imágenes en un idioma concreto
"""

import requests
import sys
import os

LANG = sys.argv[1]


def get_images():
    """
    Función que sen encarga de crear el directorio para el lenguaje y descargar las imágenes de dicho lenguaje dentro del directorio.
    """
    if not os.path.isdir(LANG):
        os.mkdir(LANG)
    for i in range(1, 19):
        res = requests.get("https://open-sdg.org/sdg-translations/assets/img/goals/%s/%s.png" % (LANG, i))
        with open("%s/%s.png" % (LANG, i), "wb") as file:
            file.write(res.content)


if __name__ == "__main__":
    get_images()