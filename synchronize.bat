echo Synchronize website? (y/n)
set /P INPUT=Type input: %=%
If /I "%Input%"=="y" goto yes
goto no

:yes
cd .\python\synch_repos\
call python .\synchronize.py
cd ..\apindex\
call .\update.bat
cd ..\..
call git add .
call git commit -m "synchronization"
call git push origin master

:no
pause