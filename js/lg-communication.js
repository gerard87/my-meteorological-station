var exec = require('child_process').exec, child;
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');

var galaxy_ip = '192.168.88.198';
var galaxy_pass = 'lqgalaxy';

module.exports.flyTo = function (city) {
    var message = "echo 'search="+city+"' > /tmp/query.txt";
    communicate(message);
};

function communicate (message) {
    var command = "sshpass -p '"+galaxy_pass+"' ssh lg@"+galaxy_ip+" \""+message+"\"";
    execute_command(command);
}

function get_server_ip () {
    /* TODO */
    // var command = "ifconfig | grep 'inet ' | awk '{print $2}'";
    // execute_command(command);
    return '192.168.88.222';
}

module.exports.show_kml_balloon = function (city, coords, data) {

    var contentString = '<table width="280"><tr><td>' +
        '<div id="content">'+'<div id="siteNotice">'+'</div>' +
        '<h1 id="firstHeading" class="firstHeading">' + city + '</h1>' +
        '<div id="bodyContent">' +
        '<p><b>Temperature: '+data[0]+'</b></p>' +
        '<p><b>Humidity: '+data[1]+'</b></p>' +
        '<p><b>Temperature2: '+data[2]+'</b></p>' +
        '<p><b>Pressure: '+data[3]+'</b></p>' +
        '<p><b>Sealevel pressure: '+data[4]+'</b></p>' +
        '<p><b>Altitude: '+data[5]+'</b></p>' +
        '</div></div>' +
        '</td></tr></table>';


    ejs.renderFile(path.join(__dirname, '..', 'public/templates/template.kml'), {
        description: contentString,
        coordinates: coords[0]+','+coords[1],
        longitude: coords[0],
        latitude: coords[1]
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var dir = path.join(__dirname, '..', 'public/kml');
            if (!fs.existsSync(dir)) {
                fs.mkdir(dir, function (err) {});
            }

            var command = 'rm '+dir+'/MMS-*.kml';
            child = exec( command, function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }

                var millis = new Date().getMilliseconds();
                var name = 'MMS-'+city+'-'+millis+'.kml';
                fs.writeFile(path.join(dir, name), data, function (err) {});

                send_single_kml(name, dir);
            });
        }
    });

};


function send_single_kml (name, route) {
    var content = 'http://' + get_server_ip() + ':3000/kml/' + name + '\n';
    var command = "echo '" + content + "' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        send_galaxy(route)
    });

}

function send_galaxy (route) {
    var file_path = route+'/kmls.txt';
    var server_path = '/var/www/html';
    var command = "sshpass -p '" + galaxy_pass + "' scp " + file_path + " lg@" + galaxy_ip + ":" + server_path;
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        setTimeout(function () {
            start_tour();
        }, 1000);

    });
}

function start_tour () {
    var message = "echo 'playtour=Show Balloon' > /tmp/query.txt";
    communicate(message)
}

module.exports.exit_tour = function () {
    var message = "echo 'exittour=Show Balloon' > /tmp/query.txt";
    communicate(message)
};


module.exports.clean_lg = function () {
    var route = path.join(__dirname, '..', 'public/kml');
    var command = "echo '' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        var file_path = route+'/kmls.txt';
        var server_path = '/var/www/html';
        var command = "sshpass -p '" + galaxy_pass + "' scp " + file_path + " lg@" + galaxy_ip + ":" + server_path;
        execute_command(command);
    });


};


function execute_command (command) {
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}
