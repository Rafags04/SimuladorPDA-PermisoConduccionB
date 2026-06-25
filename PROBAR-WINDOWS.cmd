@echo off
cd /d "%~dp0"
echo Construyendo la ultima version del simulador...
call npm run build
echo.
echo Iniciando servidor local del Simulador Permiso B en el puerto 8080...
set PORT=8080
node server-local.js
pause
