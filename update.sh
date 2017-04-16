#!/bin/sh
echo "Update System..."
sudo apt-get -y update > /dev/null
sudo apt-get -y upgrade > /dev/null
sudo apt-get -y dist-upgrade > /dev/null
sudo apt-get -y autoremove > /dev/null
echo "Updating System finished"

echo "Stopping Pi-Weather-Server..."
sudo pm2 stop pi-weather

echo "Updating npm and libraries.."
cd ~/pi-weather-server
git pull
npm install
cd
sudo npm update -g

echo "Start Pi-Weather-Server..."
sudo pm2 start pi-weather
