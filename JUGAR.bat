@echo off
title FotoPuzzle (Servidor Local)
echo ===================================================
echo Iniciando FotoPuzzle...
echo Por favor, no cierres esta ventana negra.
echo ===================================================
echo.
timeout /t 2 /nobreak >nul
start http://localhost:8000
call npx -y serve . -l 8000
