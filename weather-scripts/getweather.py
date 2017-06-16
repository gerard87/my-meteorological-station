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

    def conditions(self):

        url = WeatherClient.url_base + api_key + \
            WeatherClient.url_services["conditions"] + get_location() + "." + response_format
        f = urllib2.urlopen(url)
        response = f.read()

        resp_json = json.loads(response)['current_observation']

        data = {
            'city': resp_json['display_location']['city'],
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
    print "City: " + data['city']
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


def get_location():
    url = 'http://ipinfo.io/json'
    response = urllib2.urlopen(url)
    data = json.load(response)
    return data['city']


def get_weather():
    while True:
        weatherclient = WeatherClient(api_key)
        data = weatherclient.conditions()
        print_data(data)
        send_to_server(data)
        time.sleep(180)


def send_to_server(data):
    url = 'http://my-meteorological-station.herokuapp.com/api'
    url2 = 'http://192.168.88.222:3000/api'
    fields = {
        'city': data['city'],
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
        'icon_url': data['icon_url']
    }
    headers = {"content-type": "application/json"}
    try:
        requests.post(url, data=json.dumps(fields), headers=headers)
        requests.post(url2, data=json.dumps(fields), headers=headers)
    except requests.exceptions.RequestException as e:
        print e


if __name__ == "__main__":
    if api_key:
        get_weather()
    else:
        try:
            api_key = sys.argv[1]
            get_weather()
        except IndexError:
            print "Must provide api key in code or cmdline arg"


