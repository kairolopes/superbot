@echo off
title Evolution API Launcher
echo ==========================================
echo   Iniciando Sistema Evolution API
echo ==========================================
echo.

echo [1/3] Verificando Banco de Dados...
if exist ".\pgsql\data\postmaster.pid" (
    echo Banco de dados parece ja estar rodando.
) else (
    echo Iniciando PostgreSQL...
    start /B "" ".\pgsql\bin\pg_ctl.exe" -D ".\pgsql\data" -l ".\pgsql\logfile" start
    echo Aguardando inicializacao do banco...
    timeout /t 5 >nul
)

echo.
echo [2/3] Abrindo Painel no Navegador...
start "" "http://localhost:8080/index.html"

echo.
echo [3/3] Iniciando API...
echo ------------------------------------------
echo AGUARDE A MENSAGEM: "HTTP - ON: 8080"
echo ------------------------------------------
echo.

npm run start:prod
pause
