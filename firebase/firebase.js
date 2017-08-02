const admin = require("firebase-admin");
const utils = require('./utils');


function writeStationSensors (data) {
    admin.database().ref('stations/' + data.name).update({
        name: data.name,
        temperature: utils.round(data.temperature),
        humidity: utils.round(data.humidity),
        temperature2: utils.round(data.temperature2),
        pressure: data.pressure,
        sealevel_pressure: data.sealevel_pressure,
        altitude: data.altitude
    });
}


function writeStationAPI (data) {
    admin.database().ref('stations/' + data.name).update({
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
        icon_url: data.icon_url
    });
}


function readStations () {
    return new Promise(function (resolve, reject) {
        admin.database().ref('/stations/').once('value').then(function (snapshot) {

            let data = [];

            for (let station in snapshot.val()) {
                let s = snapshot.child(station).val();
                s.icon = utils.getIconName(snapshot.child(station).child('icon').val());
                data.push(s);
            }

            return resolve(data);

        }).catch(function (error) {
            return reject(error);
        });
    });

}


function readStationData (name) {

    return new Promise(function (resolve, reject) {

        admin.database().ref('/stations/' + name).once('value').then(function(snapshot) {
            return resolve(snapshot.val());
        }).catch(function (error) {
            return reject(error);
        });
    });

}

module.exports = {
    writeStationSensors,
    writeStationAPI,
    readStations,
    readStationData
};


