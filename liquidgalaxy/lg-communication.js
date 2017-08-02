let exec = require('child_process').exec, child;
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const galaxy_ip = '10.160.67.122';
const galaxy_pass = 'lqgalaxy';

function flyTo (city) {
    const message = "echo 'search="+city+"' > /tmp/query.txt";
    communicate(message);
}

function communicate (message) {
    const command = "sshpass -p '"+galaxy_pass+"' ssh lg@"+galaxy_ip+" \""+message+"\"";
    execute_command(command);
}

function get_server_ip () {
    /* TODO */
    // var command = "ifconfig | grep 'inet ' | awk '{print $2}'";
    // execute_command(command);
    return '10.160.67.73';
}

function show_kml_balloon (city, coords, data) {

    const contentString = '<table width="280"><tr><td>' +
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
            const dir = path.join(__dirname, '..', 'public/kml');
            if (!fs.existsSync(dir)) {
                fs.mkdir(dir, function (err) {});
            }

            const command = 'rm '+dir+'/MMS-*.kml';
            child = exec( command, function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }

                const millis = new Date().getMilliseconds();
                const name = 'MMS-'+city+'-'+millis+'.kml';
                fs.writeFile(path.join(dir, name), data, function (err) {});

                send_single_kml(name, dir);
            });
        }
    });

}


function send_single_kml (name, route) {
    const content = 'http://' + get_server_ip() + ':3000/kml/' + name + '\n';
    const command = "echo '" + content + "' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        send_galaxy(route)
    });

}

function send_galaxy (route) {
    const file_path = route+'/kmls.txt';
    const server_path = '/var/www/html';
    const command = "sshpass -p '" + galaxy_pass + "' scp " + file_path + " lg@" + galaxy_ip + ":" + server_path;
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
    const message = "echo 'playtour=Show Balloon' > /tmp/query.txt";
    communicate(message)
}

function exit_tour () {
    const message = "echo 'exittour=Show Balloon' > /tmp/query.txt";
    communicate(message)
}


function clean_lg () {
    const route = path.join(__dirname, '..', 'public/kml');
    const command = "echo '' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        const file_path = route+'/kmls.txt';
        const server_path = '/var/www/html';
        const command = "sshpass -p '" + galaxy_pass + "' scp " + file_path + " lg@" + galaxy_ip + ":" + server_path;
        execute_command(command);
    });


}


function execute_command (command) {
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

module.exports = {
    flyTo,
    show_kml_balloon,
    exit_tour,
    clean_lg
};
