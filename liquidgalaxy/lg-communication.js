let exec = require('child_process').exec, child;
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const ip = require('ip');
const content = require('./balloonContent');

const galaxy_pass = 'lqgalaxy';

function addKey (lgip) {
    const command = 'ssh-keyscan -H '+lgip+' >> ~/.ssh/known_hosts';
    execute_command(command);
}

function flyTo (lgip, latitude, longitude) {
    const message = "echo 'search="+latitude+","+longitude+"' > /tmp/query.txt";
    communicate(lgip, message);
}

function communicate (lgip, message) {
    console.log(message);
    const command = "sshpass -p '"+galaxy_pass+"' ssh lg@"+lgip+" \""+message+"\"";
    console.log(command);
    execute_command(command);
}

function get_server_ip () {
    return ip.address();
}

function show_kml_balloon (lgip, data, tour) {

    const contentString = content.getContent(data);

    const template = tour ? 'template_rotation' : 'template';


    ejs.renderFile(path.join(__dirname, '..', 'public/templates/'+ template +'.kml'), {
        description: contentString,
        coordinates: data.longitude+','+data.latitude,
        longitude: data.longitude,
        latitude: data.latitude
    }, function (err, content) {
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
                const name = 'MMS-'+data.city+'-'+millis+'.kml';
                fs.writeFile(path.join(dir, name), content, function (err) {});

                send_single_kml(lgip, name, dir, tour);
            });
        }
    });

}


function send_single_kml (lgip, name, route, tour) {
    const content = 'http://' + get_server_ip() + ':3000/kml/' + name + '\n';
    const command = "echo '" + content + "' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }

        if (tour) {
            send_galaxy_tour(lgip, route);
        } else {
            send_galaxy(lgip, route);
        }


    });

}

function send_galaxy (lgip, route) {
    const file_path = route+'/kmls.txt';
    const server_path = '/var/www/html/kmls_1.txt';
    const command = "sshpass -p '" + galaxy_pass + "' scp " + file_path + " lg@" + lgip + ":" + server_path;
    execute_command(command);
}

function send_galaxy_tour (lgip, route) {
    const file_path = route+'/kmls.txt';
    const server_path = '/var/www/html/kmls_1.txt';
    const command = "sshpass -p '" + galaxy_pass + "' scp " + file_path + " lg@" + lgip + ":" + server_path;

    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        setTimeout(function () {
            start_tour(lgip);
        }, 1000);

    });
}



function start_tour (lgip) {
    const message = "echo 'playtour=Show Balloon' > /tmp/query.txt";
    communicate(lgip, message)
}

function exit_tour (lgip) {
    const message = "echo 'exittour=Show Balloon' > /tmp/query.txt";
    communicate(lgip, message)
}


function clean_lg (lgip) {
    const route = path.join(__dirname, '..', 'public/kml');
    const command = "echo '' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        const file_path = route+'/kmls.txt';
        const server_path = '/var/www/html/kmls_1.txt';
        const command = "sshpass -p '" + galaxy_pass + "' scp " + file_path + " lg@" + lgip + ":" + server_path;
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
    start_tour,
    exit_tour,
    clean_lg,
    addKey
};
