#!/bin/bash
export NODE_ENV=test
export PINGANFU_STG_ENV = $1
echo $NODE_ENV
echo $PINGANFU_STG_ENV
pm2 reload member_conduct_Service