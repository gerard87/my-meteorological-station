var firebase = require("firebase");
var config = require('../firebase-config.json');

firebase.initializeApp(config);

module.exports.writeStationSensors = function (data) {
    firebase.database().ref('stations/' + data.name).update({
        name: data.name,
        temperature: data.temperature,
        humidity: data.humidity,
        temperature2: data.temperature2,
        pressure: data.pressure,
        sealevel_pressure: data.sealevel_pressure,
        altitude: data.altitude
    });
};


module.exports.writeStationAPI = function (data) {
    firebase.database().ref('stations/' + data.name).update({
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
};


module.exports.readStations = function (res, env) {
    firebase.database().ref('/stations/').once('value').then(function(snapshot) {

        var data = [];

        for (var station in snapshot.val()) {
            data.push(snapshot.child(station).val());
        }

        res.render('index',{
            title: 'My Meteorological Station',
            data: data,
            env: env
        });
    });
};


module.exports.readStationData = function (name) {
    firebase.database().ref('/stations/' + name).once('value').then(function(snapshot) {
        console.log(snapshot.val());
    });
};


