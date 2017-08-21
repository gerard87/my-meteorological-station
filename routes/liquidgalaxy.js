const express = require('express');
const router = express.Router();

const storage = require('node-persist');

const { lg } = require('../liquidgalaxy');
const  { firebase } = require('../firebase');



router.post('/lg/balloon', function (req, res){


    storage.init().then(function() {
        storage.getItem('lgsettings').then(function(lgsettings) {

            lg.addKey(lgsettings.ip);

            firebase.readStationData(req.body.name).then(data => {

                lg.flyTo(lgsettings.ip, lgsettings.pass, data.latitude, data.longitude);
                lg.show_kml_balloon(lgsettings.ip, lgsettings.pass, data, false);

            });

            res.end();

        })
    });

});


router.post('/lg/stop', function (req, res){
    storage.init().then(function() {
        storage.getItem('lgsettings').then(function(lgsettings) {

            lg.clean_lg(lgsettings.ip, lgsettings.pass);
            lg.exit_tour(lgsettings.ip, lgsettings.pass);
            res.end();
        });
    });

});


router.post('/lg/all', function (req, res){

    storage.init().then(function() {
        storage.getItem('lgsettings').then(function(lgsettings) {

            lg.addKey(lgsettings.ip);

            firebase.readStations().then(data => {

                lg.show_all_stations_tour(lgsettings.ip, lgsettings.pass, data);

            });

            res.end();

        })
    });

});



router.post('/lg/rotation', function (req, res){


    storage.init().then(function() {
        storage.getItem('lgsettings').then(function(lgsettings) {

            lg.addKey(lgsettings.ip);

            firebase.readStationData(req.body.name).then(data => {

                lg.show_kml_balloon(lgsettings.ip, lgsettings.pass, data, true);

            });

            res.end();

        })
    });

});


module.exports = router;