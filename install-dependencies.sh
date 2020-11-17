#!bin/bash

# Se instalan las dependencias generales
echo "Instalando dependencias"
echo "Instalando Ruby 2.5.5"
apt update
apt install git curl libssl-dev libreadline-dev zlib1g-dev autoconf bison build-essential libyaml-dev libreadline-dev libncurses5-dev libffi-dev libgdbm-dev
curl -sL https://github.com/rbenv/rbenv-installer/raw/master/bin/rbenv-installer | bash -
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc
rbenv install 2.5.5
rbenv global 2.5.5
echo "Instalando Python 3.8"
apt-get install python=3.8
echo "Instalando Bundler"
gem install bundler

# Se instalan las dependencias de los datos
cd opensdg-datos/src
echo "Instalando Dependencias Datos"
pip install -r scripts/requirements.txt

# Se instalan las dependencias de la web
cd ../../opensdg-web/src
echo "Instalando Dependencias Web"
bundle install