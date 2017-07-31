'use strict';

const express = require('express');
const router = express.Router();


process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;


const firebase = require("firebase");
const config = require('../firebase-config.json');

const utils = require('../js/utils');


firebase.initializeApp(config);



const VALUE_STATION_ACTION = 'value_station';
const ALL_VALUES_ACTION = 'all_values';
const VALUE_ARGUMENT = 'value';
const STATION_ARGUMENT = 'station';



router.post('/', function(req, res){


    const app = new App({request: req, response: res});
    // console.log('Request headers: ' + JSON.stringify(req.headers));
    // console.log('Request body: ' + JSON.stringify(req.body));


    function valueStationIntent (app) {
        let value = app.getArgument(VALUE_ARGUMENT);
        let station = normalizeName(app.getArgument(STATION_ARGUMENT));
        let val = getKeyAndUnit(value);

        firebase.database().ref('/stations/' + station).once('value').then(function(snapshot) {

            let answer = '<speak>';

            if (snapshot.hasChild(val.valueId)) {

                answer += 'The ' + value + ' is ' + snapshot.child(val.valueId).val() + val.measureUnit +
                    '. Do you want anything more?';
            } else {
                answer += 'The ' + station + ' doesn\'t have the '+ value + ' value. Try again!';
            }

            answer += '</speak>';

            app.ask(answer);
        });
    }

    function allValuesIntent (app) {

        firebase.database().ref('/stations/').once('value').then(function(snapshot) {

            let answer = '<speak>';

            for (const station in snapshot.val()) {
                answer += 'This is the information about the ' + station + ' <break time="2" />: ';

                answer += 'The city is ' + snapshot.child(station).child('city').val() + ' <break time="1"/>. ' +
                    'The weather is ' + snapshot.child(station).child('weather').val() + ' <break time="1"/>. ' +
                    'The temperature is ' + utils.round(snapshot.child(station).child('temperature').val()) + ' centigrade degrees <break time="1"/>. ' +
                    'The humidity is ' + utils.round(snapshot.child(station).child('humidity').val()) + ' % <break time="1"/>. ' +
                    'The pressure is ' + utils.round(snapshot.child(station).child('pressure').val()) + ' Pa <break time="1"/>. ' +
                    'The sea level pressure is ' + utils.round(snapshot.child(station).child('sealevel_pressure').val()) + ' Pa <break time="1"/>. ' +
                    'The altitude is ' + utils.round(snapshot.child(station).child('altitude').val()) + ' m <break time="1"/>. ' +
                    'The visibility is ' + utils.round(snapshot.child(station).child('visibility_km').val()) + ' km <break time="1"/>. ' +
                    'The wind velocity is ' + utils.round(snapshot.child(station).child('wind_kph').val()) + ' kph <break time="1"/>. ';
            }

            answer += 'That\'s all the information. Do you want anything more?</speak>';


            app.ask(answer);

        });
    }

    let actionMap = new Map();
    actionMap.set(VALUE_STATION_ACTION, valueStationIntent);
    actionMap.set(ALL_VALUES_ACTION, allValuesIntent);

    app.handleRequest(actionMap);



});

function normalizeName (name) {
    return capitalizeFirstLetter(name.replace(/\s+/g, ''));
}

function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getKeyAndUnit (value) {
    let valueId = ' ';
    let measureUnit = '';
    switch (value) {
        case 'temperature':
            valueId = value;
            measureUnit = ' centigrade degrees';
            break;
        case 'city':
        case 'weather':
            valueId = value;
            break;
        case 'humidity':
            valueId = value;
            measureUnit = ' %';
            break;
        case 'pressure':
            valueId = value;
            measureUnit = ' Pa';
            break;
        case 'sea level pressure':
            valueId = 'sealevel_pressure';
            measureUnit = ' Pa';
            break;
        case 'altitude':
            valueId = value;
            measureUnit = ' m';
            break;
        case 'wind velocity':
            valueId = 'wind_kph';
            measureUnit = ' kph';
            break;
    }
    return {
        valueId: valueId,
        measureUnit: measureUnit
    }
}

module.exports = router;