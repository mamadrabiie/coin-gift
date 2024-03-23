#!/bin/bash

DEPLOY_SERVER=$SERVER_IP

echo "Deploying to ${DEPLOY_SERVER}"
ssh ubuntu@${DEPLOY_SERVER} 'bash' < ./deploy/server.sh