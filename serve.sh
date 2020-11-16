#!/bin/bash

# Construimos los datos
cd opensdg-datos/src
echo "Construyendo datos"
python scripts/build-data
mv _site opensdg-datos
mv opensdg-datos ../../opensdg-web/src

# Construimos la web
cd ../../opensdg-web/src
echo "Sirviendo web"
bundle exec jekyll serve