# Pi-Weather web-server
A small powerfull RaspberryPi weather-station based on nodejs combined with a cool iOS-App to show realtime-data, history in charts and more.

The App can you find here:

## Requirements
* RaspberryPi 2 with raspbian jessy
* DHT22, BMP180 Sensor and cables
* Nodejs v0.12.7 with some dependencys (package.json)
* MySQL-Database


### Install required software
Install script is comming ....

1. resize microSD-Card with 
	```
	sudo raspi-config
	```
2. set locales, timezone with raspi-config
3. enable i2c with raspi-config
4. exit raspi-config and reboot
5. check resized filesystem using the whole sd-card with ``` df -h ```
6. update raspbian to latest version
	```
	sudo apt-get update && sudo apt-get dist-upgrade
	```
7. install required software
	```
	sudo apt-get install vim git-core mysql-server i2c-tools
	```
8. install wiringPi
	```
	git clone git://git.drogon.net/wiringPi
	```
	
	```
	cd wiringPi
	```
	
	```
	./build
	```
9. install bcm2835 library for dht22-sensor
	```
	wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
	```
	
	```
	tar zxvf bcm2835-1.46.tar.gz
	```
	
	```
	cd bcm2835-1.46
	```
	
	```
	make
	```
	
	```
	sudo make check
	```
	
	```
	sudo make install
	```
10. Download Node v0.12.7 arm-built and install with
	```
	sudo make install
	```
11. create mysql db and table
	```
	mysql -u benutzername -p
	```
	
	```
	CREATE DATABASE pi_weather;
	```
	
	```
	Create table data_log(time TIMESTAMP, temperature FLOAT NOT NULL, humidity FLOAT NOT NULL, pressure DOUBLE NOT NULL);
	```
12. install pm2 to run weather-server as service on startup
	```
	sudo npm install pm2 -g
	```	
	```
	sudo pm2 startup systemd -u root
	```
13. reboot
14. run pi-weather (need to run with root-permission, because server is need hardware-access)
	
	```
	sudo pm2 start index.js --watch
	```
15. add server to automatically run on bootup
	```
	sudo pm2 save
	```
	
	
## Pi-Weather API
### Get realtime-data
[http://raspberrypi:3000/api](http://raspberrypi:3000/api)
### Get realtime temperature, humidity, pressure:
To get a single realtime data call http://raspberrypi:3000/api/ and after the slash temperature, humidity, pressure to get the value you want.

##### Example:

[http://raspberrypi:3000/api/temperature](http://raspberrypi:3000/api/temperature)

### Get history data
[http://raspberrypi:3000/api/log](http://raspberrypi:3000/api/log)

### delete history 
__BE CAREFUL:__

all history data from database a completely removed
[http://raspberrypi:3000/api/log/delete](http://raspberrypi:3000/api/log) 


	
## Credits and Licenses


