#!/bin/bash

HOME_PATH=opensdg
TRANSFER_PATH=$HOME_PATH/tmp
ENV_CONF=$HOME_PATH/env
DEPLOY_TARGET_PATH=/servers/estadisticas/opensdg
OPENSDG_TAR_FILE=opensdg.tar.gz

# scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" -r etc/deploy/config/demo/* deploy@estadisticas.arte.internal:$ENV_CONF
scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" -r $OPENSDG_TAR_FILE deploy@estadisticas.arte.internal:$TRANSFER_PATH/$OPENSDG_TAR_FILE
ssh -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" deploy@estadisticas.arte.internal <<EOF

    ###
    # OPEN SDG
    ###
    
    # Update Process
    sudo rm -Rf $DEPLOY_TARGET_PATH/*
    sudo tar -xf $TRANSFER_PATH/$OPENSDG_TAR_FILE --strip-components=1 -C $DEPLOY_TARGET_PATH
    
    # Restore Configuration
    # sudo cp -rf $ENV_CONF/* $DEPLOY_TARGET_PATH
    
    sudo chown -R www-data:www-data $DEPLOY_TARGET_PATH
    rm -rf $TRANSFER_PATH/*
    # rm -rf $ENV_CONF/*

    echo "Finished deploy"

EOF
