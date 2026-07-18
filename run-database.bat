@echo off
echo ===================================================
echo [VitaLink] Starting Local Database Service...
echo ===================================================

:: Check if port 27017 is already in use
netstat -ano | findstr :27017 > nul
if %errorlevel% equ 0 (
    echo [INFO] MongoDB is already running on port 27017.
    goto end
)

:: If not running, check if docker-compose is available and start it
where docker-compose > nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Starting MongoDB container via Docker Compose...
    cd database
    docker-compose up -d
    cd ..
    goto end
)

echo [WARNING] MongoDB is not running on port 27017, and docker-compose is not installed.
echo Please ensure your local MongoDB service is started manually.
pause

:end
echo Database service check complete.
