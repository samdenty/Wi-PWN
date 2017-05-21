@echo off
call start "LOCALHOST_SERVER" cmd /c "mode con: cols=50 lines=7&color 0a&cls&echo.&echo   LOCALHOST_SERVER is running on port 80&echo  Close this window to stop the server&echo.&echo          http://127.0.0.1:80&webserver "%cd%\html" "%port%""
start http://127.0.0.1:80