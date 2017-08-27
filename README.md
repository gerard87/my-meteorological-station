

<p align="center">
  <a href="http://mymeteorologicalstation.appspot.com/"><img src="https://raw.githubusercontent.com/gerard87/my-meteorological-station/master/public/img/logos/my_meteorological_station.png"  width="350"></a>
</p>


# My meteorological station


My meteorological station is a Web app to manage homemade weather stations built with Raspberry Pi

 This is a project for Google Summer of Code 2017 - Physical Web organization


<br>

## Table of content

- [Getting started](#installation)
    - [Build your station with a Raspberry Pi](#build-your-station-with-a-raspberry-pi)
    	- [Station requirements](#station-requirements)
    	- [Connect sensors to GPIO](#connect-sensors-to-gpio)
    	- [Install and configure Raspbian](#install-and-configure-raspbian)
    - [Server installation](#server-installation)
    	- [Server requirements](#server-requirements)
    	- [Start server](#start-server)
- [Google assistant and API.AI configuration](#google-assistant-and-api.ai-configuration)
- [License](#license)

<br>

## Getting started

### Build your station (Raspberry Pi)

#### Station requirements

 - Raspberry pi (model 2B or 3B)
 - Sensor Adafruit DHT22 (3 pins)
  - Sensor Adafruit BMP 180 (4 pins)
 - Micro SD card (minimum 8GB)
 - Micro usb power adapter
 - 7 GPIO cable (female both ends)
 



#### Connect sensors to GPIO

This image shows how RPi GPIO pins are labeled.


<p align="center">
<img src="https://raw.githubusercontent.com/gerard87/my-meteorological-station/master/public/img/rpi/rpi-gpio.png"  width="700">
</p>


** DHT22 sensor:**

- '+' to '3.3v' pin 
- 'out' to pin '17'
- '-' to 'Ground' pin

** BMP180 sensor:**

- 'VIN' to '3.3v' pin 
- 'GND' to 'Ground' pin
- 'SLC' to pin '3'
- 'SDA' to pin '2'

The final result can be like this:


<p align="center">
<img src="https://raw.githubusercontent.com/gerard87/my-meteorological-station/master/public/img/rpi/rpi-connexions.png"  width="500">
</p>


#### Install and configure Raspbian

1. Follow [the official steps](https://www.raspberrypi.org/documentation/installation/noobs.md) to install Raspbian OS using NOOBS (the easiest way).

2. Enable SSH and I2C port.

	Go to Preferences > Raspberry Pi Configuration > Interfaces tab > Enable SSH and I2C like the next image.

	
<p align="center">
<img src="https://raw.githubusercontent.com/gerard87/my-meteorological-station/master/public/img/rpi/raspbian-conf.png"  width="700">
</p>


3. Get and annotate RPi ip typing `ifconfig` in the terminal.



When the server installation is completed and the application is running, you can add a new station and the station is automatically configured by the server (copying all scripts and enabling services using ssh).



### Server installation



#### Server requirements



##### Install Node.js 8

	curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
	sudo apt-get install -y nodejs
	
##### Create a firebase project

1. Enable Google sign in

	Go to Authentication > Sign-in merthod > Google > Enable

2. Add database rules

	Go to database > Rules and copy this rules.
	

		{
			"rules": {
				"beacons": {
					"$uid": {
						".read": "$uid === auth.uid",
						".write": "$uid === auth.uid"
					}
				},
				"stations": {
					".read": true,
					".write": false,
					"$uid": {
						".read": true,
						".write": "$uid === auth.uid"
					}
				},
				"users": {
					"$uid": {
						".read": "$uid === auth.uid",
						".write": "$uid === auth.uid"
					}
				}

			}
		}


3. Get client data

	Create a file named **firebase-config.json** with this structure:
	
		{
			"apiKey": "",
			"authDomain": "",
			"databaseURL": "",
			"projectId": "",
			"storageBucket": "",
			"messagingSenderId": ""
		}


	Go to Project Settings > Add Firebase to your web app button and fill all fields with the data from your project.


4. Get admin data

	Go to Project Settings > Service accounts > Generate new private key
	
	Download and rename key to **firebase-admin.json**.
	
	
##### Get a maps api key

Create a Google Cloud project, go to APIs & services, enable Maps Javascript API and Maps Geocoding API and create a key.

Create a file named **maps-key.json** with this structure and paste your key.

	{
		"apikey": ""
	}


##### Create a twitter app

Create a file called **twitter-config.json** with this structure:

	{
		"consumer_key": "",
		"consumer_secret": "",
		"access_token": "",
		"access_token_secret": ""
	}


Create a new [twitter app](https://apps.twitter.com/), go to Keys and Access Tokens and fill all fields with the values from your project.


#### Start server

1. Clone this repository

		git clone https://github.com/gerard87/my-meteorological-station.git

2. Copy config files

	Copy to the root of the project the four config files:
	
	- firebase-config.json
	- firebase-admin.json
	- maps-key.json
	- twitter-config.json
	
3. Install dependencies

		npm install
		
4. Start server

		npm start

## Google assistant and API.AI configuration


1. Go to https://api.ai/ and create a new agent.

2. Click settings > Export and import > Restore from zip.

3. Select the mmsagent.zip inside /assistant/agent folder.

4. Go to Fullfitment and enter the URL: https://< your_server >/assistant


## License
[MIT](https://github.com/gerard87/my-meteorological-station/blob/master/LICENSE) © Gerard Farré Gomez
