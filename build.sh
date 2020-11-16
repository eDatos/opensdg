#!/bin/bash

# Borramos el directorio web en caso de que existiese
rm -fr web

# Construimos los datos
cd opensdg-datos/src
echo "Construyendo datos"
python scripts/build-data
mv _site opensdg-datos
mv opensdg-datos ../../opensdg-web/src

# Construimos la web
cd ../../opensdg-web/src
echo "Construyendo web"
bundle exec jekyll build
mv _site web
mv web ../.. # Movemos la web a la raíz