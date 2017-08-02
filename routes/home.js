const express = require('express');
const router = express.Router();

const { firebase } = require('../firebase');
const config = require('../firebase-config.json');

const env = process.env.NODE_ENV || 'development';

router.get('/', function(req, res){

    firebase.readStations().then( data => {

        res.render('index',{
            title: 'Home',
            data: data,
            env: env,
            config: config
        });

    });


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



module.exports = router;
