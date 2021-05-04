cd .\python\synch_repos\
call python .\synchronize.py
cd ..\apindex\
call .\update.bat
cd ..\..

echo Push to git? (y/n)
set /P INPUT=Type input: %=%
If /I "%Input%"=="y" goto yes
goto no

:yes
call git add .
call git commit -m "synchronization"
call git push origin master

:no
pause