@echo off

set PATH=%PATH%;C:\Windows\Microsoft.NET\Framework\v4.0.30319
msbuild src\server\Sioux.TechRadar.csproj /p:Configuration=Release
pause