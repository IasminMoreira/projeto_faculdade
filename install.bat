@echo off

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permissões de Administrador...
    powershell -Command "Start-Process -FilePath '%0' -ArgumentList 'ADMIN_PASSED' -Verb RunAs"
    exit /b
)

:: Proteção contra loop e força inicialização em UTF-8 pro script fica chique de bonito
if "%~1" NEQ "UTF8_MODE" (
    cmd /v:on /c chcp 65001 >nul && "%~dpnx0" UTF8_MODE
    exit /b
)

:: Essa linha muda como o script é executado fazendo o sistema esperar os comandos executarem pra ler as variaveis depois
setlocal EnableDelayedExpansion

echo ╔══════════════════════════════════════════════════════════╗
echo ║               Instalador — Doa Aí                        ║
echo ║         Backend Laravel + Frontend React                 ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

set "ROOT=C:\projects"
set "BACKEND=!ROOT!\projeto_faculdade"
set "FRONTEND=!ROOT!\projeto_faculdade-main"

:: Garantir que o diretório raiz existe
if not exist "!ROOT!" mkdir "!ROOT!"

echo [1/7] Verificando Node.js e npm...
where node >nul 2>&1
if !errorLevel! neq 0 (
    echo        Node.js não encontrado. Baixando instalador...
    curl -L -o "!TEMP!\node_installer.msi" "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
    echo        Instalando Node.js de forma silenciosa...
    msiexec /i "!TEMP!\node_installer.msi" /qn /norestart
    del "!TEMP!\node_installer.msi"
    
    :: Forçar a atualização do PATH na sessão atual do terminal
    set "PATH=!PATH!;C:\Program Files\nodejs\"
    
    echo        Node.js instalado com sucesso.
) else (
    for /f "tokens=*" %%v in ('node -v') do echo        Node.js encontrado: %%v
)

echo.
echo [2/7] Verificando PHP e Visual C++ Redistributable...
:: Verifica o visual C++ e puxa da web se necessario
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" >nul 2>&1
if !errorLevel! neq 0 (
    echo        Visual C++ não encontrado. Baixando...
    curl -L -o "!TEMP!\vc_redist.x64.exe" "https://aka.ms/vs/17/release/vc_redist.x64.exe"
    echo        Instalando Visual C++ silenciosamente...
    start /wait "" "!TEMP!\vc_redist.x64.exe" /quiet /norestart
    del "!TEMP!\vc_redist.x64.exe"
)
::Verifica, instala e configura o PHP se não estiver presente
where php >nul 2>&1
if !errorLevel! neq 0 (
    echo        PHP não encontrado. Baixando PHP 8.4...
    curl -L -o "!TEMP!\php.zip" "https://windows.php.net/downloads/releases/php-8.4.1-Win32-vs17-x64.zip"
    echo        Extraindo PHP para C:\php...
    if not exist "C:\php" mkdir "C:\php"
    powershell -Command "Expand-Archive -Path ""$env:TEMP\php.zip"" -DestinationPath 'C:\php' -Force"
    del "!TEMP!\php.zip"
    
    :: Copiar php.ini
    if exist "C:\php\php.ini-development" copy "C:\php\php.ini-development" "C:\php\php.ini" >nul
    
    :: Habilitar extensões necessárias para o Laravel no php.ini (Correção das aspas)
    powershell -Command "(Get-Content 'C:\php\php.ini') -replace ';extension=pdo_sqlite','extension=pdo_sqlite' -replace ';extension=sqlite3','extension=sqlite3' -replace ';extension=mbstring','extension=mbstring' -replace ';extension=openssl','extension=openssl' -replace ';extension=fileinfo','extension=fileinfo' -replace ';extension=curl','extension=curl' | Set-Content 'C:\php\php.ini'"
    
    :: Adicionar ao PATH permanente e temporário
    setx /M PATH "C:\php;!PATH!" >nul
    set "PATH=C:\php;!PATH!"
    echo        PHP instalado em C:\php
) else (
    for /f "tokens=*" %%v in ('php -r "echo PHP_VERSION;"') do echo        PHP encontrado: %%v
)

echo.
echo [3/7] Verificando Composer...
where composer >nul 2>&1
if !errorLevel! neq 0 (
    echo        Composer não encontrado. Instalando...
    curl -L -o "!TEMP!\composer-setup.php" "https://getcomposer.org/installer"
    php "!TEMP!\composer-setup.php" --install-dir="C:\php" --filename=composer
    del "!TEMP!\composer-setup.php"
    echo        Composer instalado com sucesso.
) else (
    for /f "tokens=*" %%v in ('composer -V 2^>nul ^| findstr /i "Composer"') do echo        %%v
)

echo.
echo [4/7] Instalando dependências do Laravel (composer install)...
if exist "!BACKEND!" (
    cd /d "!BACKEND!"
    call composer install --no-interaction --prefer-dist
    if !errorLevel! neq 0 (
        echo [ERRO] Falha ao instalar dependências do Composer.
        pause
        exit /b 1
    )
    echo        Dependências PHP instaladas.
) else (
    echo [AVISO] Pasta Backend não encontrada em: !BACKEND!
)

echo.
echo [5/7] Configurando o Laravel...
if exist "!BACKEND!" (
    cd /d "!BACKEND!"
    :: Criar .env se não existir
    if not exist ".env" (
        if exist ".env.example" (
            copy ".env.example" ".env" >nul
            echo        .env criado a partir do .env.example
        )
    )

    :: Gerar APP_KEY
    php artisan key:generate --no-interaction >nul 2>&1
    echo        APP_KEY verificada.

    :: Criar banco SQLite se não existir
    if not exist "database\database.sqlite" (
        echo. > "database\database.sqlite"
        echo        Arquivo database.sqlite criado.
    )

    :: Rodar migrations
    echo        Rodando migrations...
    php artisan migrate --no-interaction --force
    if !errorLevel! neq 0 (
        echo [AVISO] Migrations falharam. Verifique as extensões no php.ini.
    ) else (
        echo        Migrations concluídas.
    )

    php artisan storage:link --no-interaction >nul 2>&1
    php artisan config:clear >nul 2>&1
    php artisan route:clear >nul 2>&1
    php artisan cache:clear >nul 2>&1
    echo        Caches limpos.
)

echo.
echo [6/7] Instalando dependências do Frontend (npm install)...
if exist "!FRONTEND!" (
    cd /d "!FRONTEND!"
    call npm install
    if !errorLevel! neq 0 (
        echo [ERRO] Falha ao instalar dependências do npm.
        pause
        exit /b 1
    )
    echo        Dependências npm instaladas.
) else (
    echo [AVISO] Pasta Frontend não encontrada em: !FRONTEND!
)

echo.
echo [7/7] Configurando hosts do Windows (doaai.local)...
set "HOSTS_FILE=C:\Windows\System32\drivers\etc\hosts"
findstr /C:"doaai.local" "!HOSTS_FILE!" >nul 2>&1
if !errorLevel! neq 0 (
    echo.>> "!HOSTS_FILE!"
    echo 127.0.0.1  doaai.local>> "!HOSTS_FILE!"
    echo 127.0.0.1  api.doaai.local>> "!HOSTS_FILE!"
    echo        Domínios adicionados ao hosts.
    ipconfig /flushdns >nul 2>&1
    echo        Cache DNS limpo.
) else (
    echo        Domínios já existem no hosts.
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                  Instalação concluída!                   ║
echo ╠══════════════════════════════════════════════════════════╣
echo ║                                                          ║
echo ║  Para rodar o projeto abra DOIS terminais:               ║
echo ║                                                          ║
echo ║  Terminal 1 — Backend Laravel:                           ║
echo ║    cd C:\projects\projeto_faculdade                      ║
echo ║    php artisan serve --host=api.doaai.local --port=8000  ║
echo ║                                                          ║
echo ║  Terminal 2 — Frontend React:                            ║
echo ║    cd C:\projects\projeto_faculdade-main                 ║
echo ║    npm run dev                                           ║
echo ║                                                          ║
echo ║  Acesse: http://doaai.local:5173                         ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
pause
endlocal