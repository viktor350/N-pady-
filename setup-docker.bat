@echo off
echo ================================
echo   Bookio Pro - Docker Setup
echo ================================
echo.

REM Farby nie su dostupne v CMD, ale skusime aspon pekny output

echo [1/5] Kontrolujem Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker nie je nainstalovany!
    echo.
    echo Prosim nainštaluj Docker Desktop z:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)
echo [OK] Docker je nainstalovany
echo.

echo [2/5] Spustam PostgreSQL databazu v Dockeri...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Nepodarilo sa spustit Docker container!
    echo.
    echo Uisti sa ze Docker Desktop bezi.
    pause
    exit /b 1
)
echo [OK] PostgreSQL databaza spustena
echo.

echo Cakam 10 sekund kym sa databaza spusti...
timeout /t 10 /nobreak >nul
echo.

echo [3/5] Instalacie baličkov...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Nepodarilo sa nainštalovať balíčky!
    pause
    exit /b 1
)
echo [OK] Balicky nainštalovane
echo.

echo [4/5] Nastavujem backend...
cd backend

if not exist .env (
    echo Vytváram .env súbor...
    copy .env.example .env >nul
    echo [OK] .env súbor vytvoreny
) else (
    echo [OK] .env súbor uz existuje
)

echo Generujem Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Nepodarilo sa vygenerovať Prisma Client!
    cd ..
    pause
    exit /b 1
)

echo Spustam databazove migracie...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo [WARNING] Migracie zlyhali, ale to moze byt OK ak uz boli spustene
)

cd ..
echo [OK] Backend nastaveny
echo.

echo [5/5] Instalacia dokoncena!
echo.
echo ================================
echo   USPECH! Aplikacia je pripravena
echo ================================
echo.
echo Teraz spusti aplikaciu prikazom:
echo.
echo    npm run dev
echo.
echo Aplikacia sa otvori na:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo.
echo ================================
echo.
pause
