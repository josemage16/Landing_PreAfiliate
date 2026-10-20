@echo off
title Subir Landing Pre-Afiliado a GitHub
echo ================================================================
echo   Subiendo rama main a GitHub:
echo   https://github.com/josemage16/Landing_PreAfiliate
echo ================================================================
echo.
"C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe" push -u origin main
echo.
if %errorlevel% equ 0 (
    echo [EXITO] La rama main fue subida correctamente a GitHub.
) else (
    echo [AVISO] Si te solicita inicio de sesion, inicia sesion con tu cuenta josemage16 en el navegador.
)
echo.
pause
