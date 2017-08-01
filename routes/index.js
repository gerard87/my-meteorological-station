const express = require('express');
const router = express.Router();

const firebase = require('../js/firebase');
const lg = require('../js/lg-communication');
const twitter = require('../js/twitter');
const config = require('../firebase-config.json');

router.get('/', function(req, res){

    firebase.readStations(res);

});


router.get('/settings', function(req, res){

    res.render('settings', {
        title: 'Settings',
        config: config
    });

});


router.post('/sensors', function(req, res){

    firebase.writeStationSensors(req.body);

    res.json(req.body);
});


router.post('/api', function(req, res){

    firebase.writeStationAPI(req.body);

    res.json(req.body);
});


router.post('/lg', function (req, res){

    if (req.body.stop === 'true') {
        lg.exit_tour();
        lg.clean_lg();
    } else {
        const sensors_array = [req.body.temperature, req.body.humidity, req.body.temperature2,
            req.body.pressure, req.body.sealevel_pressure, req.body.altitude];
        const coords = [req.body.longitude, req.body.latitude];

        lg.show_kml_balloon(req.body.city, coords, sensors_array);
    }
    res.end();

});


router.post('/tweet', function (req, res) {
    twitter.tweetUpdate();
    res.end();
});


module.exports = router;
