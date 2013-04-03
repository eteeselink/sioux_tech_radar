#!/bin/bash
# Absolute path to this script. 
SCRIPT=$(cd `dirname "${BASH_SOURCE[0]}"` && pwd)/`basename "${BASH_SOURCE[0]}"`
NGINXDATA=`dirname $SCRIPT`/nginx-data
if [ -e "/usr/loc/var/run/nginx.pid" ] 
then
	nginx -p $NGINXDATA -c $NGINXDATA/conf/nginx.conf -s reload
else
	nginx -p $NGINXDATA -c $NGINXDATA/conf/nginx.conf 
fi
echo "now goto http://localhost:54321"
