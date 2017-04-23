#!/bin/sh
if [ ! $( id -u ) -eq 0 ]; then
    echo "ERROR: Please run the script as root" ;exit 1
fi

echo "Update System..."
apt-get -y update > /dev/null
apt-get -y upgrade > /dev/null
apt-get -y dist-upgrade > /dev/null
apt-get -y autoremove > /dev/null
echo "Updating System finished"

echo "install required software"
apt-get -y install vim git-core i2c-tools unzip zip  > /dev/null

echo "changing hostname to pi-weather.."
hostn=$(cat /etc/hostname)
#change hostname in /etc/hosts & /etc/hostname
sed -i "s/$hostn/pi-weather/g" /etc/hosts
sed -i "s/$hostn/pi-weather/g" /etc/hostname

#install bcm2835 library for dht-sensor
echo "install bcm2835 library for dht-sensor"
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.52.tar.gz
tar zxvf bcm2835-1.52.tar.gz
cd bcm2835-1.52
./configure
make
make check 
make install
cd
rm -rf bcm2835-1.52
rm bcm2835-1.52.tar.gz

#install wiringp
git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin
./build
cd ..
rm -rf wiringPi

#install nodejs
echo "Installing nodejs..."
wget https://nodejs.org/dist/v6.10.1/node-v6.10.1-linux-$("arch").tar.gz
tar -xvf node-v6.10.1-linux-$("arch").tar.gz
cd node-v6.10.1-linux-$("arch")
cp -R * /usr/local
rm node-v6.10.1-linux-armv6l.tar.gz
rm -rf node-v6.10.1-linux-armv6l

#install mysql
echo "Installing MySQL-Database..."
apt-get install -y mysql-server  > /dev/null 
echo "create database pi_weather" | mysql -u root -p
echo "USE pi_weather; Create table data_log(time TIMESTAMP NOT NULL, temperature FLOAT NOT NULL, humidity FLOAT NOT NULL, pressure DOUBLE NOT NULL);" | mysql -u root -p

# install node depencies
npm install pm2 -g
pm2 startup systemd -u root

# Installing repo and configure server
git clone https://github.com/Hendrik44/pi-weather-server.git
cd pi-weather-server
npm install

echo "Please check if server runs without error and type \"node index.js\"\n"
echo "If no error appear press CTRL-C and start it via pm2: \"sudo pm2 start index.js --name pi-weather\""

#configure auto update raspbian
#sudo apt-get install cron-apt > /dev/null
#echo "upgrade -y -o APT::Get::Show-Upgraded=true" > /etc/cron-apt/action.d/5-secupdates
#echo "Security Paketliste" > /etc/apt/sources.list.d/security.sources.list

#echo 'OPTIONS="-o quiet=1 -o Dir::Etc::SourceList=/etc/apt/sources.list.d/security.sources.list -o Dir::Etc::SourceParts=\"/dev/null\""' > /etc/cron-apt/config.d/5-secupdates 

#echo "configure cron-apt complete!\n"
#echo "check with: sudo cron-apt -s if it works"

#dyndns
#sudo apt-get install ddclient
# https://www.ra-networks.at/2015/02/21/raspberry-pi-ddns/
