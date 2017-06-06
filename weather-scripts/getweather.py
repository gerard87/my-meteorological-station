#!/usr/bin/env python
# -*- coding: utf-8 -*-


import sys
import urllib2
import json

api_key = None

location = 'Lleida'
response_format = 'json'


class WeatherClient(object):

    url_base = 'http://api.wunderground.com/api/'
    url_services = { "conditions": "/conditions/q/ES/" }

    def __init__(self, apikey):
        super(WeatherClient, self).__init__()
        self.api_key = api_key

    def conditions(self, location):

        url = WeatherClient.url_base + api_key + \
            WeatherClient.url_services[
                "conditions"] + location + "." + response_format
        f = urllib2.urlopen(url)
        response = f.read()

        resp_json = json.loads(response)['current_observation']

        data = {}

        data['city'] = resp_json['display_location']['city']
        data['temp_high'] = str(resp_json["temp_c"])
        data['weather'] = resp_json["weather"]
        data['relative_humidity'] = resp_json["relative_humidity"]

        return data


def print_data(data):
    print "City: " + data['city']
    print "Current temperature: " + data['temp_high'] + " *C"
    print "Weather: " + data['weather']
    print "Relative humidity: " + data['relative_humidity']


if __name__ == "__main__":
    if not api_key:
        try:
            api_key = sys.argv[1]
        except IndexError:
            print "Must provide api key in code or cmdline arg"

    weatherclient = WeatherClient(api_key)
    print_data(weatherclient.conditions(location))
