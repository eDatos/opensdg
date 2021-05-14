#!/bin/bash

# Borramos construcciones anteriores
if [[ -d opensdg-datos/src/_site ]]; then rm -fr opensdg-datos/src/_site; fi
if [[ -d opensdg-datos/src/opensdg-datos ]]; then rm -fr opensdg-datos/src/opensdg-datos; fi
if [[ -d opensdg-web/src/_site ]]; then rm -fr opensdg-web/src/_site; fi
if [[ -d opensdg-web/src/opensdg-datos ]]; then rm -fr opensdg-web/src/opensdg-datos; fi

# Construimos los datos
cd opensdg-datos/src || exit
echo "Construyendo datos"
python3 scripts/build_data.py
mv _site opensdg-datos
mv opensdg-datos ../../opensdg-web/src

# Construimos la web
cd ../../opensdg-web/src || exit
cp opensdg-datos/es/data/*.csv _data/csv
echo "Sirviendo web"
bundle exec jekyll serve