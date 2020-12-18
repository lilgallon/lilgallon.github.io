cd .\python\synch_repos\
python .\synchronize.py
cd ..\apindex\
.\update.bat
cd ..\..
git add .
git commit -m "synchronization"
git push origin master
pause