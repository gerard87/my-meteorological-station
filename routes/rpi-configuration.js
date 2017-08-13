const express = require('express');
const router = express.Router();

const { configuration } = require('../rpi-configuration');
const { firebase } = require('../firebase');


router.post('/config', function(req, res){

    firebase.createStation(req.body.uid).then(station => {

        configuration.configureStation(station, req.body, true);

        res.end();
    });

});

router.post('/edit', function(req, res){

    configuration.configureStation(req.body.station, req.body, false);

    res.end();
});


module.exports = router;