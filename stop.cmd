@echo off

pushd %~dp0\nginx-data
nginx -s stop
popd