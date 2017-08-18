const express = require('express');
const router = express.Router();

const storage = require('node-persist');

const { lg } = require('../liquidgalaxy');
const  { firebase } = require('../firebase');



router.post('/lg/balloon', function (req, res){


    storage.init().then(function() {
        storage.getItem('lgip').then(function(lgip) {

            lg.addKey(lgip);

            firebase.readStationData(req.body.name).then(data => {

                lg.flyTo(lgip, data.latitude, data.longitude);
                lg.show_kml_balloon(lgip, data, false);

            });

            res.end();

        })
    });

});


router.post('/lg/stop', function (req, res){
    storage.init().then(function() {
        storage.getItem('lgip').then(function(lgip) {

            lg.exit_tour(lgip);
            lg.clean_lg(lgip);

            res.end();
        });
    });

});


router.post('/lg/all', function (req, res){

    storage.init().then(function() {
        storage.getItem('lgip').then(function(lgip) {

            lg.addKey(lgip);

            firebase.readStations().then(data => {

                lg.show_all_stations_tour(lgip, data);

            });

            res.end();

        })
    });

});



router.post('/lg/rotation', function (req, res){


    storage.init().then(function() {
        storage.getItem('lgip').then(function(lgip) {

            lg.addKey(lgip);

            firebase.readStationData(req.body.name).then(data => {

                lg.show_kml_balloon(lgip, data, true);

            });

            res.end();

        })
    });

});


module.exports = router;