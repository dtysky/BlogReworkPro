#!/usr/bin/sh

echo "Used for installing all moudules..."
echo "You must install 'mongodb', 'python 2.10.x with pip', 'node.js 5.9.0 with npm at first !'"

# Install python modules
cd Back/
echo "Installing VirtualEnv......"
#sudo pip2 install virtualenv
if [ -d python ]; then
	echo "Back/python has been existed......"
else
    echo "Creating virtual env..."
    virtualenv python
fi
echo "Install python modules"
python/bin/pip install pymongo
python/bin/pip install watchdog
python/bin/pip install flask
python/bin/pip install flask-compress
python/bin/pip install pygments
python/bin/pip install markdown

# Install node modules
cd ../Front/
echo "Install node modules"
npm install
npm install forever -g