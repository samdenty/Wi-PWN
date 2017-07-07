@echo off
set "path=..\html"
set port=8030
pushd additional
call start "LOCALHOST_SERVER" cmd /c "mode con: cols=50 lines=7&color 0a&cls&echo.&echo   LOCALHOST_SERVER is running on port %port%&echo  Close this window to stop the server&echo.&echo          http://127.0.0.1:80&webserver %path% %port%"
start http://localhost:%port%