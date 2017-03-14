#!/bin/sh
echo "Update System..."
sudo apt-get -y update > /dev/null
sudo apt-get -y upgrade > /dev/null
sudo apt-get -y dist-upgrade > /dev/null
sudo apt-get -y autoremove > /dev/null
echo "Updating System finished"

echo "install required software"
sudo apt-get -y install vim git-core i2c-tools unzip zip

#install bcm2835 library for dht-sensor
echo "install bcm2835 library for dht-sensor"
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar zxvf bcm2835-1.46.tar.gz
cd bcm2835-1.46
./configure
make
sudo make check 
sudo make install
cd
rm -r bcm2835-1.46
rm bcm2835-1.46.tar.gz

#install wiringp
git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin
./build
cd
rm -r wiringPi

#install nodejs
wget http://piw.jg-bits.de/node-v0.12.7-raspberrybuild.zip
sudo unzip node-v0.12.7-raspberrybuild.zip
cd node-v0.12.7
sudo make install
cd ..
rm -r node-v0.12.7
rm node-v0.12.7-raspberrybuild.zip

#install mysql
sudo apt-get install mysql-server
mysql -u root -p
create database pi_weather;
Create table data_log(time TIMESTAMP NOT NULL, temperature FLOAT NOT NULL, humidity FLOAT NOT NULL, pressure DOUBLE NOT NULL);

# install node depencies
sudo npm install pm2 -g
sudo pm2 startup systemd -u pi

#configure auto update raspbian
#sudo apt-get install cron-apt > /dev/null
#echo "upgrade -y -o APT::Get::Show-Upgraded=true" > /etc/cron-apt/action.d/5-secupdates
#echo "Security Paketliste" > /etc/apt/sources.list.d/security.sources.list

#echo 'OPTIONS="-o quiet=1 -o Dir::Etc::SourceList=/etc/apt/sources.list.d/security.sources.list -o Dir::Etc::SourceParts=\"/dev/null\""' > /etc/cron-apt/config.d/5-secupdates 

#echo "configure cron-apt complete!\n"
#echo "check with: sudo cron-apt -s if it works"

#dyndns
sudo apt-get install ddclient
# https://www.ra-networks.at/2015/02/21/raspberry-pi-ddns/