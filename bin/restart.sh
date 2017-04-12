#!/bin/bash
export NODE_ENV=test
export PINGANFU_STG_ENV = $1
pm2 reload member_conduct_Service