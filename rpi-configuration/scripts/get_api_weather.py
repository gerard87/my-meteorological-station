#!/usr/bin/env python
# -*- coding: utf-8 -*-


import sys
import urllib2
import json
import time
import requests

api_key = None
response_format = 'json'


class WeatherClient(object):

    url_base = 'http://api.wunderground.com/api/'
    url_services = {"conditions": "/conditions/q/ES/"}

    def __init__(self, apikey):
        super(WeatherClient, self).__init__()
        self.api_key = api_key

    def conditions(self, city):

        url = WeatherClient.url_base + api_key + \
            WeatherClient.url_services["conditions"] + city + "." + response_format
        f = urllib2.urlopen(url)
        response = f.read()

        resp_json = json.loads(response)['current_observation']

        data = {
            'weather': resp_json['weather'],
            'wind_dir': resp_json['wind_dir'],
            'wind_kph': str(resp_json['wind_kph']),
            'dewpoint_c': str(resp_json['dewpoint_c']),
            'heat_index_c': str(resp_json['heat_index_c']),
            'windchill_c': str(resp_json['windchill_c']),
            'feelslike_c': str(resp_json['feelslike_c']),
            'visibility_km': str(resp_json['visibility_km']),
            'precip_today_metric': str(resp_json['precip_today_metric']),
            'icon': resp_json['icon'],
            'icon_url': resp_json['icon_url']
        }

        return data


def print_data(data):
    print "Weather: " + data['weather']
    print "wind_dir: " + data['wind_dir']
    print "wind_kph: " + data['wind_kph']
    print "dewpoint_c: " + data['dewpoint_c']
    print "heat_index_c: " + data['heat_index_c']
    print "windchill_c: " + data['windchill_c']
    print "feelslike_c: " + data['feelslike_c']
    print "visibility_km: " + data['visibility_km']
    print "precip_today_metric: " + data['precip_today_metric']
    print "icon: " + data['icon']
    print "icon_url: " + data['icon_url']


def get_weather(name, ip_server, uid, city, latitude, longitude, alias):
    while True:
        weatherclient = WeatherClient(api_key)
        data = weatherclient.conditions(city)
        print_data(data)
        send_to_server(data, name, ip_server, uid, city, latitude, longitude, alias)
        time.sleep(180)


def send_to_server(data, name, ip_server, uid, city, latitude, longitude, alias):
    url = 'http://mymeteorologicalstation.appspot.com/api'
    url2 = 'http://{}:3000/api'.format(ip_server)

    fields = {
        'name': name,
        'city': city,
        'latitude': latitude,
        'longitude': longitude,
        'weather': data['weather'],
        'wind_dir': data['wind_dir'],
        'wind_kph': data['wind_kph'],
        'dewpoint_c': data['dewpoint_c'],
        'heat_index_c': data['heat_index_c'],
        'windchill_c': data['windchill_c'],
        'feelslike_c': data['feelslike_c'],
        'visibility_km': data['visibility_km'],
        'precip_today_metric': data['precip_today_metric'],
        'icon': data['icon'],
        'icon_url': data['icon_url'],
        'uid': uid,
        'alias': alias
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
        api_key = sys.argv[1]
        name = sys.argv[2]
        ip_server = sys.argv[3]
        uid = sys.argv[4]
        city = sys.argv[5]
        latitude = sys.argv[6]
        longitude = sys.argv[7]
        alias = sys.argv[8]
        get_weather(name, ip_server, uid, city, latitude, longitude, alias)
    except IndexError:
        print "Must provide api key, station name and local server ip in code or cmdline arg"


