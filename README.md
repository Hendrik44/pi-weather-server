[![Known Vulnerabilities](https://snyk.io/test/github/hendrik44/pi-weather-server/badge.svg)](https://snyk.io/test/github/hendrik44/pi-weather-server)
# Pi-Weather web-server
A small powerfull weather-station for the raspberrypi based on nodejs combined with a cool iOS-App to show realtime-data, history in charts and more.

The App can you find here: comming soon...

## Requirements
* RaspberryPi 2/3 or Zero W with raspbian jessy
* DHT22, BMP180 Sensor and cables
* Nodejs v6 and some dependencys (package.json)
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
6. Install git if not installed & cloning repo
	```
	sudo apt-get -y install vim git-core
	git clone https://github.com/Hendrik44/pi-weather-server.git
	cd pi-weather-server
	```	
7. run install script
	```
	sh install.sh
	```
8. reboot
9. run pi-weather (need to run with root-permission, because server is need hardware-access)
	
	```
	sudo pm2 start index.js --name pi-weather
	```
10. add server to automatically run on bootup
	```
	sudo pm2 save
	```		
## Pi-Weather API
### Get realtime-data
[http://raspberrypi.local:3000/live/sensor](http://raspberrypi.local:3000/live/sensor)
### Get realtime temperature, humidity, pressure:
To get a single realtime data call http://raspberrypi.local:3000/live/sensor and after the slash temperature, humidity, pressure to get the value you want.

##### Example:

[http://raspberrypi:3000/api/live/sensor/temperature](http://raspberrypi:3000/api/live/sensor/temperature)

### Get history data
[http://raspberrypi:3000/api/history/sensor/](http://raspberrypi:3000/api/history/sensor/)

### delete history 
__BE CAREFUL:__

all history data from database a completely removed
[http://raspberrypi:3000/api/history/delete](http://raspberrypi:3000/history/log) 
	
## Credits and Licenses
This project was a part of my bachelor thesis and now opensource see LICENSE file. 

