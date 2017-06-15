#!/usr/bin/python

import os
import sys

def get_galaxy_ip():
    return 'x.x.x.x'

def get_password():
    return ''

def flyto(localization):
    message = "echo 'search={localization}' > /tmp/query.txt".format(localization=localization)
    comunicate(message)

def comunicate(message):
    print message
    print get_galaxy_ip()
    print ("sshpass -p '{lg_pass}' ssh lg@{lg_ip} \"{message}\"".format(message=message, lg_ip=get_galaxy_ip(), lg_pass=get_password()))

    os.system("sshpass -p '{lg_pass}' ssh lg@{lg_ip} \"{message}\"".format(message=message, lg_ip=get_galaxy_ip(), lg_pass=get_password()))

if __name__ == "__main__":
    try:
        city = sys.argv[1]
        flyto(city)
    except IndexError:
        print "City arg empty"

