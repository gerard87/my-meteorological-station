#!/usr/bin/python

import os
import sys
import simplekml
import subprocess
import time
from geopy.geocoders import Nominatim


def get_galaxy_ip():
    return '192.168.88.198'


def get_server_ip():
    p = subprocess.Popen(
        "ifconfig | grep 'inet ' | awk '{print $2}'",
        shell=True,
        stdout=subprocess.PIPE)
    ips = (p.communicate()[0]).split()

    ip_server = ''

    for ip in ips:
        if ip != '127.0.0.1':
            ip_server = ip

    return ip_server


def get_password():
    return 'lqgalaxy'


def flyto(localization):
    message = "echo 'search={localization}' > /tmp/query.txt".format(localization=localization)
    comunicate(message)


def comunicate(message):
    print message
    print get_galaxy_ip()
    print ("sshpass -p '{lg_pass}' ssh lg@{lg_ip} \"{message}\"".format(message=message, lg_ip=get_galaxy_ip(), lg_pass=get_password()))

    os.system("sshpass -p '{lg_pass}' ssh lg@{lg_ip} \"{message}\"".format(message=message, lg_ip=get_galaxy_ip(), lg_pass=get_password()))


def create_kml_balloon(localization):

    contentString = '<div id="content">'+'<div id="siteNotice">'+'</div>' + \
        '<h1 id="firstHeading" class="firstHeading">' + localization + '</h1>' + \
        '<div id="bodyContent">' + \
        '<p><b>Temperature:</b></p>' + \
        '<p><b>Humidity:</b></p>' + \
        '<p><b>Temperarure2:</b></p>' + \
        '<p><b>Pressure:</b></p>' + \
        '<p><b>Sealevel pressure:</b></p>' + \
        '<p><b>Altitude:</b></p>' + \
        '</div>' + \
        '</div>'

    kml = simplekml.Kml()

    geolocator = Nominatim()
    location = geolocator.geocode(localization)

    kml.newpoint(name='My meteorological station', description=contentString,
                 coords=[(location.longitude, location.latitude)], gxballoonvisibility=1)

    millis = int(round(time.time() * 1000))
    filename = 'MMS-' + localization + '-' + str(millis) + '.kml'

    path = os.path.join(os.getcwd(), 'public/kml/')

    os.system('rm '+os.getcwd()+'/public/kml/MMS-*.kml')

    kml.save(path+filename)
    send_single_kml(filename, path)


def send_single_kml(kmlname, path):
    ip_server = get_server_ip()
    content = "http://" + str(ip_server) + ":3000/kml/" + kmlname + "\n"
    os.system("echo '" + content + "' > "+path+"/kmls.txt")
    send_galaxy(path)


def send_galaxy(path):
    file_path = path+"/kmls.txt"
    server_path = "/var/www/html"
    print("sshpass -p '" + get_password() + "' scp " + file_path + " lg@" + get_galaxy_ip() + ":" + server_path)
    os.system("sshpass -p '" + get_password() + "' scp " + file_path + " lg@" + get_galaxy_ip() + ":" + server_path)


if __name__ == "__main__":
    try:
        city = sys.argv[1]
        flyto(city)
        create_kml_balloon(city)
    except IndexError:
        print "City arg empty"

