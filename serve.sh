#!/bin/bash
# Absolute path to this script. 
SCRIPT=$(cd `dirname "${BASH_SOURCE[0]}"` && pwd)/`basename "${BASH_SOURCE[0]}"`
NGINXDATA=`dirname $SCRIPT`/nginx-data
nginx -p $NGINXDATA -c $NGINXDATA/conf/nginx.conf
echo "now goto http://localhost:54321"
