@echo off
title Lancement Clinique - Frontend & Backend

REM Lancer le frontend
start cmd /k "cd /d %~dp0\fontend && npm run dev -- --host"

REM Lancer le backend
start cmd /k "cd /d %~dp0\backend && php artisan serve --host=0.0.0.0 --port=8000"

echo Serveurs lancés !
pause
