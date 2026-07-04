
@echo off
echo ===================================================
echo Iniciando Simulador PDA con Flask (Entorno Local)
echo ===================================================
echo.
echo 1. Comprobando/Instalando dependencias de Python...
pip install -r requirements.txt
echo.
echo 2. Compilando la aplicacion frontend (Vite)...
call npm.cmd run build
echo.
echo 3. Arrancando el servidor Flask en http://localhost:8080...
python app.py
pause
