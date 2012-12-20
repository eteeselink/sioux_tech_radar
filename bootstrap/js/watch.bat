@echo off

title typescript-compiler
pushd %~dp0
tsc -w tech-radar.ts
popd