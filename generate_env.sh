#!/bin/bash

SERVER_IP=$(hostname -I | awk '{print $1}')

if [[ -z "$SERVER_IP" ]]; then
    echo "Can't get IP，Please check the internet setting"
    exit 1
fi

ENV_FILE=".env"

echo "VITE_API_BASE_URL=http://$SERVER_IP" > $ENV_FILE

echo ".env is generated already, the content is："
cat $ENV_FILE
