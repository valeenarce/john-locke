@echo off
chcp 65001 >nul
title Locke · Servidor local

echo.
echo  ╔══════════════════════════════════════╗
echo  ║   John Locke · Exposición Digital   ║
echo  ║         Servidor local               ║
echo  ╚══════════════════════════════════════╝
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127\." ^| findstr /v "169\."') do (
  set IP=%%a
  goto :found
)
:found
set IP=%IP: =%

set PORT=5500

echo  Tu IP local: %IP%
echo  Puerto:      %PORT%
echo.
echo  ┌─────────────────────────────────────────────────────┐
echo  │  Abrí esto en el celular (mismo WiFi):              │
echo  │                                                     │
echo  │     http://%IP%:%PORT%
echo  │                                                     │
echo  │  O escaneá el QR de abajo con la cámara            │
echo  └─────────────────────────────────────────────────────┘
echo.

where node >nul 2>&1
if %errorlevel% == 0 (
  node -e "const url='http://%IP%:%PORT%';const q=encodeURIComponent(url);const {execSync}=require('child_process');try{execSync('curl -s \"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='+q+'\" -o \"%TEMP%\\locke_qr.png\"',{stdio:'inherit'});execSync('start %TEMP%\\locke_qr.png');}catch(e){}" 2>nul
)

echo  Iniciando servidor...
echo  (Cerrá esta ventana para apagar el servidor)
echo.

timeout /t 2 /nobreak >nul
start http://localhost:%PORT%

npx --yes serve "%~dp0" -l %PORT% --no-clipboard

pause
