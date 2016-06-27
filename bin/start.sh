#!/bin/bash
export NODE_ENV=production
pm2 start ../app.js --name member_conduct_Service  -i ma
