@echo off
:: Essa linha muda como o script é executado fazendo o sistema esperar os comandos executarem pra ler as variaveis depois
setlocal EnableDelayedExpansion

echo Inicializando o sistema..
echo.

set "ROOT=C:\projects"
set "BACKEND=!ROOT!\projeto_faculdade"
set "FRONTEND=!ROOT!\projeto_faculdade-main"

:: Verifica se o windows tem o recurso wt que abre guias em janelas do terminal
where wt >nul 2>&1
if %errorlevel% equ 0 goto :USA_WT
goto :USA_START

:USA_WT
:: Usa o sistema moderno de abas na mesma janela
wt -d "!BACKEND!" --title "Backend Laravel" cmd /k "php artisan serve --host=api.doaai.local --port=8000" ; -w 0 nt -d "!FRONTEND!" --title "Frontend React" cmd /k "npm run dev"
goto :ABRE_NAVEGADOR

:USA_START
:: Abre em janelas separadas caso o Windows não tenha o recurso
start "Servidor Backend — Laravel" cmd /k "cd /d "!BACKEND!" && php artisan serve --host=api.doaai.local --port=8000"
start "Servidor Frontend — React" cmd /k "cd /d "!FRONTEND!" && npm run dev"

goto :ABRE_NAVEGADOR

:ABRE_NAVEGADOR
echo .
echo Aguardando os servidores iniciarem para abrir o navegador..

timeout /t 3 >nul

:: Abre o link do projeto rodando
start "" "http://doaai.local:5173"

endlocal