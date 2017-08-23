'use strict';


process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;


const { firebase, utils } = require('../firebase');
const assistant_utils = require('./utils');
const storage = require('node-persist');
const { lg } = require('../liquidgalaxy');



const VALUE_STATION_ACTION = 'value_station';
const ALL_VALUES_ACTION = 'all_values';
const STATION_BALLOON_ACTION = 'station_balloon';
const STATION_ROTATION_BALLOON_ACTION = 'station_rotation_balloon';
const ALL_STATIONS_BALLOON_ACTION = 'all_stations_balloon';
const CLEAN_LG_ACTION = 'clean_lg';
const VALUE_ARGUMENT = 'value';
const NUMBER_ARGUMENT = 'number';



function webhook (req, res) {

    const app = new App({request: req, response: res});
    // console.log('Request headers: ' + JSON.stringify(req.headers));
    // console.log('Request body: ' + JSON.stringify(req.body));


    function valueStationIntent (app) {
        const value = app.getArgument(VALUE_ARGUMENT);
        const number = app.getArgument(NUMBER_ARGUMENT);

        const station = 'Station'+ number;
        let val = '';
        if (value !== null) val = assistant_utils.getKeyAndUnit(value);

        firebase.readStationData(station).then(data => {
            let answer = '<speak>';

            if (val.valueId in data) {

                answer += 'The ' + value + ' is ' + data[val.valueId] + val.measureUnit +
                    '. Do you want anything more?';
            } else {
                answer += 'The ' + station + ' doesn\'t have the '+ value + ' value. Try again!';
            }

            answer += '</speak>';

            app.ask(answer);

        }).catch(error => {

        });

    }

    function allValuesIntent (app) {

        firebase.readStations().then(data => {

            let answer = '<speak>';

            for (const station of data) {

                answer += 'This is the information about the ' + station.name + ' <break time="2" />: ';

                answer += 'The city is ' + station.city + ' <break time="1"/>. ' +
                    'The weather is ' + station.weather + ' <break time="1"/>. ' +
                    'The temperature is ' + utils.round(station.temperature) + ' centigrade degrees <break time="1"/>. ' +
                    'The humidity is ' + utils.round(station.humidity) + ' % <break time="1"/>. ' +
                    'The pressure is ' + utils.round(station.pressure) + ' Pa <break time="1"/>. ' +
                    'The sea level pressure is ' + utils.round(station.sealevel_pressure) + ' Pa <break time="1"/>. ' +
                    'The altitude is ' + utils.round(station.altitude) + ' m <break time="1"/>. ' +
                    'The visibility is ' + utils.round(station.visibility_km) + ' km <break time="1"/>. ' +
                    'The wind velocity is ' + utils.round(station.wind_kph) + ' kph <break time="1"/>. ';

            }

            answer += 'That\'s all the information. Do you want anything more?</speak>';

            app.ask(answer);

        }).catch(error => {

        });


    }


    function stationBalloon (app) {

        const number = app.getArgument(NUMBER_ARGUMENT);
        const station = 'Station'+ number;

        let answer = '<speak>';

        storage.init().then(function() {
            storage.getItem('lgsettings').then(function(lgsettings) {

                lg.addKey(lgsettings.ip);

                firebase.readStationData(station).then(data => {

                    lg.flyTo(lgsettings.ip, lgsettings.pass, data.latitude, data.longitude);
                    lg.show_kml_balloon(lgsettings.ip, lgsettings.pass, data, false);

                });

                answer += 'Let\'s go, showing information about '+ station +' to liquid galaxy. <break time="2" /> ';
                answer += 'Do you want anything more?</speak>';

                app.ask(answer);

            })
        });
    }

    function stationRotationBalloon (app) {

        const number = app.getArgument(NUMBER_ARGUMENT);
        const station = 'Station'+ number;

        let answer = '<speak>';

        storage.init().then(function() {
            storage.getItem('lgsettings').then(function(lgsettings) {

                lg.addKey(lgsettings.ip);

                firebase.readStationData(station).then(data => {

                    lg.show_kml_balloon(lgsettings.ip, lgsettings.pass, data, true);

                });


                answer += 'Let\'s go, showing rotation of the '+ station +' to liquid galaxy. <break time="2" /> ';
                answer += 'Do you want anything more?</speak>';

                app.ask(answer);

            })
        });
    }


    function allStationsBalloon (app) {

        let answer = '<speak>';

        storage.init().then(function() {
            storage.getItem('lgsettings').then(function(lgsettings) {

                lg.addKey(lgsettings.ip);

                firebase.readStations().then(data => {

                    lg.show_all_stations_tour(lgsettings.ip, lgsettings.pass, data);

                });

                answer += 'Let\'s go, showing tour of all stations to liquid galaxy. <break time="2" /> ';
                answer += 'Do you want anything more?</speak>';

                app.ask(answer);

            })
        });

    }


    function cleanGalaxy (app) {

        let answer = '<speak>';

        storage.init().then(function() {
            storage.getItem('lgsettings').then(function(lgsettings) {

                lg.clean_lg(lgsettings.ip, lgsettings.pass);
                lg.exit_tour(lgsettings.ip, lgsettings.pass);


                answer += 'Cleaning Liquid Galaxy. <break time="2" /> ';
                answer += 'Do you want anything more?</speak>';

                app.ask(answer);

            });
        });

    }


    let actionMap = new Map();
    actionMap.set(VALUE_STATION_ACTION, valueStationIntent);
    actionMap.set(ALL_VALUES_ACTION, allValuesIntent);
    actionMap.set(STATION_BALLOON_ACTION, stationBalloon);
    actionMap.set(STATION_ROTATION_BALLOON_ACTION, stationRotationBalloon);
    actionMap.set(ALL_STATIONS_BALLOON_ACTION, allStationsBalloon);
    actionMap.set(CLEAN_LG_ACTION, cleanGalaxy);

    app.handleRequest(actionMap);

}


module.exports = {
    webhook
};