const express = require('express');
const router = express.Router();

const storage = require('node-persist');

const { lg } = require('../liquidgalaxy');
const  { firebase } = require('../firebase');

router.post('/', function (req, res){


    storage.init().then(function() {
        storage.getItem('lgip').then(function(lgip) {

            lg.addKey(lgip);

            if (req.body.stop === 'true') {

                //lg.exit_tour();
                lg.clean_lg(lgip);

            } else {

                firebase.readStationData(req.body.name).then(data => {

                    lg.flyTo(lgip, data.city);
                    lg.show_kml_balloon(lgip, data);

                });

            }

            res.end();

        })
    });



});

module.exports = router;