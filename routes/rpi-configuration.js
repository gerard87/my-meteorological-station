const express = require('express');
const router = express.Router();

const { configuration } = require('../rpi-configuration');
const { firebase } = require('../firebase');


router.post('/', function(req, res){

    firebase.createStation(req.body.uid).then(station => {

        console.log(station);
        console.log(req.body);

        configuration.configureStation(station, req.body);

        res.end();
    });


});


module.exports = router;