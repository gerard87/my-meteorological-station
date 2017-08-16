const admin = require("firebase-admin");
const utils = require('./utils');


function writeStationSensors (data) {

    isValidStation(data.uid, data.name).then(valid => {

        if (valid) {
            admin.database().ref('stations/' + data.uid + '/' + data.name).update({
                name: data.name,
                temperature: utils.round((Number(data.temperature)+Number(data.temperature2))/2),
                humidity: utils.round(data.humidity),
                pressure: utils.round(data.pressure),
                sealevel_pressure: utils.round(data.sealevel_pressure),
                altitude: data.altitude
            });
        }

    });


}


function writeStationAPI (data) {

    isValidStation(data.uid, data.name).then(valid => {

        if (valid) {

            const dir = utils.getDirection(data.wind_dir);

            admin.database().ref('stations/' + data.uid + '/' + data.name).update({
                city: data.city,
                longitude: data.longitude,
                latitude: data.latitude,
                weather: data.weather,
                wind_dir: dir.direction,
                wind_grades: dir.grades,
                wind_kph: utils.round(data.wind_kph),
                wind_kph_icon: utils.getWindIcon(data.wind_kph),
                dewpoint_c: data.dewpoint_c,
                heat_index_c: data.heat_index_c,
                windchill_c: data.windchill_c,
                feelslike_c: data.feelslike_c,
                visibility_km: utils.round(data.visibility_km),
                precip_today_metric: data.precip_today_metric,
                icon: data.icon,
                icon_img: utils.getIconName(data.icon),
                alias: data.alias
            });
        }

    });

}


function createBeacon (name, uid, station) {
    return admin.database().ref('beacons/' + uid + '/').push({
        name: name,
        station: station,
    });
}



function readStations () {
    return new Promise(function (resolve, reject) {
        admin.database().ref('/stations/').once('value').then(function (snapshot) {

            let data = [];

            for (const user in snapshot.val()) {

                for (const station in snapshot.child(user).val()) {
                    data.push(snapshot.child(user).child(station).val());
                }

            }

            return resolve(data);

        }).catch(function (error) {
            return reject(error);
        });
    });

}


function readStationData (name) {

    return new Promise(function (resolve, reject) {

        admin.database().ref('/stations/').once('value').then(function(snapshot) {

            for (const user in snapshot.val()) {
                for (const station in snapshot.child(user).val()) {

                    if (station === name) {
                        return resolve(snapshot.child(user).child(station).val());
                    }

                }
            }

        }).catch(function (error) {
            return reject(error);
        });
    });

}

function getUserStations (uid) {
    return new Promise(function (resolve, reject) {

        admin.database().ref('/users/' + uid).once('value').then(function(snapshot) {

            let data = [];

            for (const station in snapshot.val()) {
                data.push(snapshot.child(station).val());
            }

            return resolve(data);

        }).catch(function (error) {
            return reject(error);
        });

    });

}

function isValidStation (uid, name) {

    return new Promise(function (resolve, reject) {

        admin.database().ref('/users/' + uid).once('value', function (snapshot) {
            for (const station in snapshot.val()) {
                if (name === snapshot.child(station).val()) {
                    return resolve(true);
                }
            }
            return resolve(false);

        }).catch(function (error) {
            return reject(error);
        });

    });
}


function createStation (uid) {
    return new Promise(function (resolve, reject) {

        let station = 'Station';

        getFirstEmptyIndex().then(index => {

            station += index;

            admin.database().ref('users/' + uid).push(
                station
            );

            return resolve(station);

        }).catch(function (error) {
            return reject(error);
        });


    });

}


function getFirstEmptyIndex () {
    return new Promise(function (resolve, reject) {
        readStations().then(data => {
            let freeCounter = 1;

            for (const station in data){
                if (data[station].name === 'Station'+freeCounter) {
                    freeCounter++;
                }
            }
            return resolve(freeCounter);
        });
    });

}


function getBeacon (id) {
    return new Promise(function (resolve, reject) {
        admin.database().ref('beacons/').once('value').then(snapshot => {

            for (const user in snapshot.val()) {
                for (const beacon in snapshot.child(user).val()) {

                    if (beacon === id) {
                        return resolve(snapshot.child(user).child(beacon).val());
                    }
                }
            }
        }).catch(error => {
            return reject(error);
        })
    });
}

function getUserBeacons (uid) {

    return new Promise(function (resolve, reject) {

        admin.database().ref('/beacons/' + uid).once('value').then(function(snapshot) {

            let data = [];

            for (const beacon in snapshot.val()) {
                const values = snapshot.child(beacon).val();
                values.id = beacon;
                data.push(values);
            }

            return resolve(data);

        }).catch(function (error) {
            return reject(error);
        });

    });

}


module.exports = {
    writeStationSensors,
    writeStationAPI,
    readStations,
    readStationData,
    getUserStations,
    createStation,
    createBeacon,
    getBeacon,
    getUserBeacons
};


