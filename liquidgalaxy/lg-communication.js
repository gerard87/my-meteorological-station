let exec = require('child_process').exec, child;
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const galaxy_pass = 'lqgalaxy';

function addKey (lgip) {
    const command = 'ssh-keyscan -H '+lgip+' >> ~/.ssh/known_hosts';
    execute_command(command);
}

function flyTo (lgip, city) {
    const message = "echo 'search="+city+"' > /tmp/query.txt";
    communicate(lgip, message);
}

function communicate (lgip, message) {
    const command = "sshpass -p '"+galaxy_pass+"' ssh lg@"+lgip+" \""+message+"\"";
    execute_command(command);
}

function get_server_ip () {
    /* TODO */
    // var command = "ifconfig | grep 'inet ' | awk '{print $2}'";
    // execute_command(command);
    return '10.160.67.185';
}

function show_kml_balloon (lgip, data) {

    const contentString = '<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.blue_grey-red.min.css"/>' +
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&lang=en"/>' +
        '<table width="470" style="font-family: Roboto;"><tr><td>' +
        '<div id="content">'+'<div id="siteNotice">'+'</div>' +
        '<h1 id="firstHeading" class="firstHeading" style="color: #474747;font-size: 1.5em;line-height:0.2;text-align:center">My meteorological station</h1>' +
        '<h1 id="firstHeading" class="firstHeading" style="color: #474747;font-size: 2em;line-height:1;text-align:center">' + data.name + '</h1>' +
        '<div id="bodyContent" style="text-align: center;">' +

            '<div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid" style="width: 98%">'+

            '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:2.5em;color:#474747;line-height:1;">'+data.city+'</p>' +
                '<p style="font-size:3.5em;color:#474747;line-height:1;">'+data.temperature+' ºC</p>' +
                '<p style="font-size:1.5em;color:#474747;line-height:1;">Feels like '+data.feelslike_c+' ºC</p>' +

            '</div>' +
            '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer" style="text-align: center;">' +

                '<img src="/img/'+data.icon_img+'.png" height="96" width="96"/>' +
                '<p style="font-size:1.5em;color:#474747;">'+data.weather+'</p>' +

            '</div>' +

            '</div>' +


            '<div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid" style="width: 98%">'+

                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                    '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Humidity:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                    '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.humidity+' %</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Pressure:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.pressure+' Pa</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Sealevel pressure:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.sealevel_pressure+' Pa</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Altitude:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.altitude+' m</p>' +
                '</div>' +

            '</div>' +


            '<div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid" style="width: 98%">'+

                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Wind velocity:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.wind_kph+' kph</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Wind direction:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.wind_dir+' </p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Precipitation (daily):</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.precip_today_metric+' mm</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Visibility:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.visibility_km+' km</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Dewpoint:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.dewpoint_c+' ºC</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Heat index:</p>' +
                '</div>' +


                '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
                '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.heat_index_c+' ºC</p>' +
                '</div>' +

            '</div>' +



        '</div></div>' +
        '</td></tr></table>';


    ejs.renderFile(path.join(__dirname, '..', 'public/templates/template.kml'), {
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

                send_single_kml(lgip, name, dir);
            });
        }
    });

}


function send_single_kml (lgip, name, route) {
    const content = 'http://' + get_server_ip() + ':3000/kml/' + name + '\n';
    const command = "echo '" + content + "' > "+route+"/kmls.txt";
    child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        send_galaxy(lgip, route)
    });

}

function send_galaxy (lgip, route) {
    const file_path = route+'/kmls.txt';
    const server_path = '/var/www/html/kmls_1.txt';
    const command = "sshpass -p '" + galaxy_pass + "' scp " + file_path + " lg@" + lgip + ":" + server_path;
    execute_command(command);
    /*child = exec( command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        setTimeout(function () {
            start_tour();
        }, 1000);

    });*/
}

function start_tour () {
    const message = "echo 'playtour=Show Balloon' > /tmp/query.txt";
    communicate(message)
}

function exit_tour () {
    const message = "echo 'exittour=Show Balloon' > /tmp/query.txt";
    communicate(message)
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
    exit_tour,
    clean_lg,
    addKey
};
