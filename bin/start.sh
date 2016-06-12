#!/bin/bash
export NODE_ENV=production
pm2 start ../app.js --name conductService  -i ma
