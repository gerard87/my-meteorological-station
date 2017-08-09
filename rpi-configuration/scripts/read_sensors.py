#!/usr/bin/python

import sys
import Adafruit_DHT
import Adafruit_BMP.BMP085 as BMP085
import requests
import json

def read_sensors(name, ip_server, uid):
    while(True):
        sensor = Adafruit_DHT.DHT22
        pin = 17

        humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

        if humidity is not None and temperature is not None:
            print('DHT22')
            print('Temp={0:0.2f} *C  Humidity={1:0.2f}%'.format(temperature, humidity))
        else:
            print('Failed to get reading. Try again!')


        sensor = BMP085.BMP085()
        temperature2 = sensor.read_temperature()
        pressure = sensor.read_pressure()
        sealevel_pressure = sensor.read_sealevel_pressure()
        altitude = sensor.read_altitude()

        print('')
        print('BMP180')
        print('Temp = {0:0.2f} *C'.format(temperature2))
        print('Pressure = {0:0.2f} Pa'.format(pressure))
        print('Altitude = {0:0.2f} m'.format(altitude))
        print('Sealevel Pressure = {0:0.2f} Pa'.format(sealevel_pressure))


        url = 'http://mymeteorologicalstation.appspot.com/sensors'
        url2 = 'http://{}:3000/sensors'.format(ip_server)
        fields = {
            'name': name,
            'temperature': '{0:0.2f}'.format(temperature),
            'humidity': '{0:0.2f}'.format(humidity),
            'temperature2': '{0:0.2f}'.format(temperature2),
            'pressure': '{0:0.2f}'.format(pressure),
            'sealevel_pressure': '{0:0.2f}'.format(sealevel_pressure),
            'altitude': '{0:0.2f}'.format(altitude),
            'uid': uid
        }
        headers = {"content-type": "application/json"}

        try:
            r = requests.post(url, data=json.dumps(fields), headers=headers)
        except requests.exceptions.RequestException as e:
            print e

        try:
            r = requests.post(url2, data=json.dumps(fields), headers=headers)
        except requests.exceptions.RequestException as e:
            print e

if __name__ == "__main__":

    try:
        name = sys.argv[1]
        ip_server = sys.argv[2]
        uid = sys.argv[3]
        read_sensors(name, ip_server, uid)
    except IndexError:
        print "Must provide station name and server ip in code or cmdline arg"
