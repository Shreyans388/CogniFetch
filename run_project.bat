@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   CogniFetch (RAG Web UI) Launcher
echo ===================================================
echo.

:: Check if docker command is available by running it
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not in your current session's PATH.
    echo Searching in standard Docker Desktop installation paths...
    
    if exist "C:\Program Files\Docker\Docker\resources\bin\docker.exe" (
        echo Found Docker installation in: C:\Program Files\Docker\Docker\resources\bin
        set "PATH=C:\Program Files\Docker\Docker\resources\bin;!PATH!"
    ) else if exist "C:\Program Files\Docker\Docker\resources\docker.exe" (
        echo Found Docker installation in: C:\Program Files\Docker\Docker\resources
        set "PATH=C:\Program Files\Docker\Docker\resources;!PATH!"
    )
)

:: Confirm docker works now
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Could not locate or execute docker.exe automatically.
    echo Please make sure Docker Desktop is installed and running, and added to your system PATH.
    echo.
    pause
    exit /b 1
)

:: Check if Docker daemon is running
echo Checking if Docker engine is active...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker command was found, but the Docker engine is not running.
    echo Please make sure Docker Desktop is started (green indicator) and try again.
    echo.
    pause
    exit /b 1
)
echo [OK] Docker engine is running.
echo.

echo Select launch mode:
echo [1] Standard Development Mode (Full Docker, hot-reload)
echo [2] Production Mode (Full Docker, pre-built static assets)
echo [3] Troubleshooting Mode (Full Docker, BuildKit disabled - fixes OneDrive issues)
echo [4] Hybrid Mode (Databases in Docker, Backend/Frontend run locally) [Recommended if Docker build fails]
echo.
set /p mode="Enter choice [1, 2, 3 or 4, default is 1]: "

if "%mode%"=="" set mode=1

if "%mode%"=="4" (
    echo.
    echo [Step 1/3] Starting database containers in Docker (MySQL, ChromaDB, MinIO)...
    docker compose -f docker-compose.dev.yml up -d db chromadb minio
    
    if !errorlevel! neq 0 (
         echo [ERROR] Failed to start database containers in Docker.
         pause
         exit /b !errorlevel!
    )
    echo Databases are up and running!
    echo.
    
    echo [Step 2/3] Starting Python backend in a new window...
    start "CogniFetch Backend" cmd /k "echo Installing backend packages... && pip install -r backend\requirements.txt && python run_local_backend.py"
    
    echo [Step 3/3] Starting Next.js frontend in a new window...
    :: Check if pnpm is installed, otherwise fall back to npm
    where pnpm >nul 2>&1
    if !errorlevel! equ 0 (
        start "CogniFetch Frontend" cmd /k "echo Installing frontend packages with pnpm... && cd frontend && pnpm install && pnpm dev"
    ) else (
        start "CogniFetch Frontend" cmd /k "echo Installing frontend packages with npm... && cd frontend && npm install && npm run dev"
    )
    
    echo.
    echo ===================================================
    echo   Services are starting up in separate windows!
    echo ===================================================
    echo Frontend will be active at: http://localhost:3000
    echo Backend will be active at:  http://localhost:8000
    echo.
    pause
    exit /b 0
)

if "%mode%"=="3" (
    echo Starting in Troubleshooting Mode (BuildKit Disabled)...
    set DOCKER_BUILDKIT=0
    set COMPOSE_DOCKER_CLI_BUILD=0
    docker compose -f docker-compose.dev.yml up -d --build
) else if "%mode%"=="2" (
    echo Starting in Production Mode...
    docker compose -f docker-compose.yml up -d --build
) else (
    echo Starting in Development Mode...
    docker compose -f docker-compose.dev.yml up -d --build
)

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start Docker containers.
    echo.
    echo TIP: If you see "invalid file request Dockerfile", it is usually because
    echo of OneDrive syncing issues. Try selecting Option [4] Hybrid Mode or
    echo Option [3] Troubleshooting Mode.
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo   CogniFetch is starting up!
echo ===================================================
echo.
echo You can access the services at the following URLs:
echo.
echo   - Frontend UI:        http://localhost (or http://127.0.0.1.nip.io)
echo   - API Documentation:  http://localhost/redoc (or http://127.0.0.1.nip.io/redoc)
echo   - MinIO Console:      http://localhost:9001 (or http://127.0.0.1.nip.io:9001)
echo.
echo To stop the services, run:
echo   docker compose down
echo.
pause
