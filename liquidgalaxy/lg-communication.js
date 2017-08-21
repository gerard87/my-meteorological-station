let exec = require('child_process').exec, child;
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const ip = require('ip');
const content = require('./balloonContent');

function addKey (lgip) {
    const command = 'ssh-keyscan -H '+lgip+' >> ~/.ssh/known_hosts';
    execute_command(command);
}

function flyTo (lgip, lgpass, latitude, longitude) {
    const message = "echo 'search="+latitude+","+longitude+"' > /tmp/query.txt";
    communicate(lgip, lgpass, message);
}

function communicate (lgip, lgpass, message) {
    console.log(message);
    const command = "sshpass -p '"+lgpass+"' ssh lg@"+lgip+" \""+message+"\"";
    console.log(command);
    execute_command(command);
}

function get_server_ip () {
    return ip.address();
}

function show_kml_balloon (lgip, lgpass, data, tour) {

    const contentString = content.getContent(data);

    const template = tour ? 'template_rotation' : 'template';

    const values = {
        description: contentString,
        coordinates: data.longitude+','+data.latitude,
        longitude: data.longitude,
        latitude: data.latitude
    };

    renderFile(data.city, values, template).then(data => {
        send_single_kml(lgip, lgpass, data[0], data[1], tour);
    });

}


function show_all_stations_tour (lgip, lgpass, data) {

    for (const station in data) {

        const contentString = content.getContent(data[station]);
        data[station].description = contentString;

    }

    const values = { data: data };

    renderFile('all', values, 'template_all').then(data => {
        send_single_kml(lgip, lgpass, data[0], data[1], true);
    });
}



function send_single_kml (lgip, lgpass, name, route, tour) {
    const content = 'http://' + get_server_ip() + ':3000/kml/' + name + '\n';
    const command = "echo '" + content + "' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }

        if (tour) {
            send_galaxy_tour(lgip, lgpass, route);
        } else {
            send_galaxy(lgip, lgpass, route);
        }


    });

}

function send_galaxy (lgip, lgpass, route) {
    const file_path = route+'/kmls.txt';
    const server_path = '/var/www/html/kmls_1.txt';
    const command = "sshpass -p '" + lgpass + "' scp " + file_path + " lg@" + lgip + ":" + server_path;
    execute_command(command);
}

function send_galaxy_tour (lgip, lgpass, route) {
    const file_path = route+'/kmls.txt';
    const server_path = '/var/www/html/kmls_1.txt';
    const command = "sshpass -p '" + lgpass + "' scp " + file_path + " lg@" + lgip + ":" + server_path;

    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        setTimeout(function () {
            start_tour(lgip, lgpass);
        }, 1000);

    });
}



function start_tour (lgip, lgpass) {
    const message = "echo 'playtour=Show Balloon' > /tmp/query.txt";
    communicate(lgip, lgpass, message)
}

function exit_tour (lgip, lgpass) {
    const message = "echo 'exittour=Show Balloon' > /tmp/query.txt";
    communicate(lgip, lgpass, message)
}


function clean_lg (lgip, lgpass) {
    const route = path.join(__dirname, '..', 'public/kml');
    const command = "echo '' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        const file_path = route+'/kmls.txt';
        const server_path = '/var/www/html/kmls_1.txt';
        const command = "sshpass -p '" + lgpass + "' scp " + file_path + " lg@" + lgip + ":" + server_path;
        execute_command(command);
    });


}


function renderFile (fname, values, template) {
    return new Promise(function (resolve, reject) {
        ejs.renderFile(path.join(__dirname, '..', 'public/templates/'+ template +'.kml'), values, function (err, content) {
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
                    const name = 'MMS-'+fname+'-'+millis+'.kml';
                    fs.writeFile(path.join(dir, name), content, function (err) {});

                    return resolve([name, dir]);
                });
            }
        });
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
    addKey,
    show_all_stations_tour
};
