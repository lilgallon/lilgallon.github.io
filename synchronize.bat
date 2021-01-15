cd .\python\synch_repos\
call python .\synchronize.py
cd ..\apindex\
call .\update.bat
cd ..\..
call git add .
call git commit -m "synchronization"
call git push origin master
pause