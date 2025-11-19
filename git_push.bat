@echo off
chcp 65001 > nul
echo ==========================================
echo   Enviando cambios a GitHub - Portafolio
echo ==========================================
echo.

:: 1. Agregar todos los archivos modificados
echo [1/3] Agregando archivos (git add)...
git add .

:: 2. Solicitar mensaje para el historial
echo.
set /p commit_msg="Escribe una descripcion de los cambios (o presiona Enter para usar default): "
if "%commit_msg%"=="" set commit_msg="Actualizacion del portafolio web"

echo.
echo [2/3] Guardando cambios localmente (git commit)...
git commit -m "%commit_msg%"

:: 3. Enviar a la nube
echo.
echo [3/3] Subiendo a GitHub (git push)...
git push

echo.
echo ==========================================
if %ERRORLEVEL% EQU 0 (
    echo   EXITO: Los cambios se han subido correctamente.
) else (
    echo   ERROR: Hubo un problema al subir los cambios.
)
echo ==========================================
pause
