#!/bin/sh

echo 'Make sure you are in the right space and trying logging in using cf login'

cf create-service compose-for-elasticsearch Standard icon-elasticsearch
cf create-service compose-for-postgresql Standard icon-postgresql
cf create-service compose-for-rabbitmq Standard icon-rabbitmq