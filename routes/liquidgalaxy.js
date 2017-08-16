const express = require('express');
const router = express.Router();

const storage = require('node-persist');

const { lg } = require('../liquidgalaxy');
const  { firebase } = require('../firebase');

router.post('/lg', function (req, res){


    storage.init().then(function() {
        storage.getItem('lgip').then(function(lgip) {

            lg.addKey(lgip);

            if (req.body.stop === 'true') {

                lg.clean_lg(lgip);

            } else {

                firebase.readStationData(req.body.name).then(data => {

                    lg.flyTo(lgip, data.latitude, data.longitude);
                    lg.show_kml_balloon(lgip, data, false);

                });

            }

            res.end();

        })
    });

});


router.post('/lgrotation', function (req, res){


    storage.init().then(function() {
        storage.getItem('lgip').then(function(lgip) {

            lg.addKey(lgip);

            if (req.body.stop === 'true') {

                lg.exit_tour(lgip);
                lg.clean_lg(lgip);

            } else {

                firebase.readStationData(req.body.name).then(data => {

                    lg.show_kml_balloon(lgip, data, true);

                });

            }

            res.end();

        })
    });

});




module.exports = router;