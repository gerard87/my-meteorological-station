const admin = require("firebase-admin");
const utils = require('./utils');


function writeStationSensors (data) {

    isValidStation(data.uid, data.name).then(valid => {

        if (valid) {
            admin.database().ref('stations/' + data.uid + '/' + data.name).update({
                name: data.name,
                temperature: utils.round(data.temperature),
                humidity: utils.round(data.humidity),
                temperature2: utils.round(data.temperature2),
                pressure: data.pressure,
                sealevel_pressure: data.sealevel_pressure,
                altitude: data.altitude
            });
        }

    });


}


function writeStationAPI (data) {

    isValidStation(data.uid, data.name).then(valid => {

        if (valid) {
            admin.database().ref('stations/' + data.uid + '/' + data.name).update({
                city: data.city,
                longitude: data.longitude,
                latitude: data.latitude,
                weather: data.weather,
                wind_dir: data.wind_dir,
                wind_kph: data.wind_kph,
                dewpoint_c: data.dewpoint_c,
                heat_index_c: data.heat_index_c,
                windchill_c: data.windchill_c,
                feelslike_c: data.feelslike_c,
                visibility_km: data.visibility_km,
                precip_today_metric: data.precip_today_metric,
                icon: data.icon,
                icon_img: utils.getIconName(data.icon)
            });
        }

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

module.exports = {
    writeStationSensors,
    writeStationAPI,
    readStations,
    readStationData,
    getUserStations
};


