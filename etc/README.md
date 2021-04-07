# Utilidades de desarrollo y otros

## Utilidades

### download_images.py

Este script se encarga de descargar las imágenes de las ODS cargadas en los servidores de OpenSDG en un idioma concreto.

Los idiomas pueden ser `ar, de, en, es, fr, hy, kk, ru o zh-Hans`.

El script generará un directorio con el idioma y dentro de él estarán ubicadas todas las imágenes.

Por ejemplo

```
python download_images.py de
```

creará la siguiente estructura:

```
de/
    - 1.png
    - 2.png
    ...  // Y así hasta 18.png
```

Este directorio que contiene las imágenes deberá ser ubicado en `opensdg-web/src/assets/img/ods_images`.