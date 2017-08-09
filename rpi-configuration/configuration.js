const SSH = require('simple-ssh');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
let exec = require('child_process').exec, child;


function configureStation (name, data) {


    createServicesFile('weathersensors.service', {
        user: data.user,
        name: name,
        serverip: data.serverip,
        uid: data.uid,
    }).then(function () {
        createServicesFile('weatherapi.service', {
            user: data.user,
            apikey: data.apikey,
            name: name,
            serverip: data.serverip,
            uid: data.uid,
        }).then(function () {

            addkey(data);

        });
    });


}


function addkey (data) {
    const command = 'ssh-keyscan -H '+data.ip+' >> ~/.ssh/known_hosts';

    child = exec(command, function (error, stdout, stderr) {

        copyScripts(data);

    });

}

function copyScripts (data) {
    const file_path = path.join(__dirname, '.', 'scripts/*');
    const station_path = '~';
    const command = "sshpass -p '" + data.pass + "' scp " + file_path + " " + data.user +"@" + data.ip + ":" + station_path;

    child = exec(command, function (error, stdout, stderr) {

        copyServices(data);

    });
}

function copyServices (data) {
    const file_path = path.join(__dirname, '.', 'services/generated/*');
    const station_path = '~';
    const command = "sshpass -p '" + data.pass + "' scp " + file_path + " " + data.user +"@" + data.ip + ":" + station_path;

    child = exec(command, function (error, stdout, stderr) {

        updateInstallDep(data);

    });
}


function updateInstallDep (data) {

    const ssh = new SSH({
        host: data.ip,
        user: data.user,
        pass: data.pass
    });


    ssh.exec('sudo apt-get update && ' +
        'sudo apt-get install git build-essential python-dev && ' +
        'pip install -r requirements.txt', {
        pty: true,
        out: function (stdout) {
            console.log(stdout);
        },
        exit: function (code) {

            installDHT(ssh)

        }
    }).start();

}

function installDHT (ssh) {
    ssh.exec('git clone https://github.com/adafruit/Adafruit_Python_DHT.git && ' +
        'cd Adafruit_Python_DHT && sudo python setup.py install', {
        pty: true,
        out: function (stdout) {
            console.log(stdout);
        },
        exit: function (code) {

            installBMP(ssh);

        }
    });

    return false;
}


function installBMP (ssh) {
    ssh.exec('git clone https://github.com/adafruit/Adafruit_Python_BMP.git && ' +
        'cd Adafruit_Python_BMP && sudo python setup.py install', {
        pty: true,
        out: function (stdout) {
            console.log(stdout);
        },
        exit: function (code) {

            moveServiceFile(ssh);

        }
    });

    return false;
}


function moveServiceFile (ssh) {

    ssh.exec('sudo mv ~/weathersensors.service /lib/systemd/system/ && ' +
        'sudo mv ~/weatherapi.service /lib/systemd/system/', {
        pty: true,
        out: function (stdout) {
            console.log(stdout);
        },
        exit: function (code) {

            enableServices(ssh);

        }
    });


    return false;

}


function enableServices (ssh) {
    ssh.exec('sudo systemctl enable weathersensors.service && ' +
        'sudo systemctl enable weatherapi.service', {
        pty: true,
        out: function (stdout) {
            console.log(stdout);
        },
        exit: function (code) {
            restartServices(ssh);
        }
    });

    return false;


}

function restartServices (ssh) {
    ssh.exec('sudo systemctl restart weathersensors.service && ' +
        'sudo systemctl restart weatherapi.service', {
        pty: true,
        out: function (stdout) {
            console.log(stdout);
        }
    });

    return false;
}



function createServicesFile(fname, data) {
    return new Promise(function (resolve, reject) {
        ejs.renderFile(path.join(__dirname, '.', 'services/'+fname), data, function (err, data) {
            if (err) {
                console.log(err);
                return reject();
            } else {
                const dir = path.join(__dirname, '.', 'services/generated');
                if (!fs.existsSync(dir)) {
                    fs.mkdir(dir, function (err) {});
                }
                fs.writeFile(path.join(dir, fname), data, function (err) {});

                return resolve();
            }
        });
    });


}


module.exports = {
    configureStation
};