@echo off
echo ===================================================
echo [VitaLink] Bootstrapping Entire System...
echo ===================================================

:: 1. Database
call run-database.bat

:: 2. Backend (starts in new window)
echo [VitaLink] Launching backend service...
start "VitaLink Backend" cmd /c "run-backend.bat"

:: 3. Frontend (starts in new window)
echo [VitaLink] Launching frontend service...
start "VitaLink Frontend" cmd /c "run-frontend.bat"

echo ===================================================
echo All services have been launched!
echo - Database: Port 27017
echo - Backend: http://localhost:8081
echo - Frontend: http://localhost:8080 (or similar)
echo ===================================================
