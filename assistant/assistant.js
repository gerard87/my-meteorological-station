'use strict';


process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;


const { firebase, utils } = require('../firebase');
const assistant_utils = require('./utils');



const VALUE_STATION_ACTION = 'value_station';
const ALL_VALUES_ACTION = 'all_values';
const VALUE_ARGUMENT = 'value';
const STATION_ARGUMENT = 'station';



function webhook (req, res) {

    const app = new App({request: req, response: res});
    // console.log('Request headers: ' + JSON.stringify(req.headers));
    // console.log('Request body: ' + JSON.stringify(req.body));


    function valueStationIntent (app) {
        const value = app.getArgument(VALUE_ARGUMENT);
        const station = assistant_utils.normalizeName(app.getArgument(STATION_ARGUMENT));
        const val = assistant_utils.getKeyAndUnit(value);

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

    let actionMap = new Map();
    actionMap.set(VALUE_STATION_ACTION, valueStationIntent);
    actionMap.set(ALL_VALUES_ACTION, allValuesIntent);

    app.handleRequest(actionMap);

}


module.exports = {
    webhook
};