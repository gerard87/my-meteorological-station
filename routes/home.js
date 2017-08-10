const express = require('express');
const router = express.Router();

const storage = require('node-persist');

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


router.get('/new', function(req, res){

    res.render('newStation', {
        title: 'New station',
        config: config
    });

});


router.get('/manage', function(req, res){

    firebase.getUserStations(req.query.id).then(data => {

        res.render('manage', {
            title: 'Manage stations',
            data: data,
            config: config,
            id: req.query.id,
            env: env
        });

    });


});


router.get('/createform', function(req, res){

    res.render('createform', {
        title: 'Station configuration',
        config: config
    });

});


router.get('/editform', function(req, res){

    res.render('editform', {
        title: 'Station edit',
        config: config,
        station: req.query.station
    });

});


router.get('/settings', function(req, res){

    storage.init().then(function() {
        storage.getItem('lgip').then(function(lgip) {
            res.render('settings', {
                title: 'Settings',
                config: config,
                lgip: lgip
            });
        });
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


router.post('/saveSettings', function(req, res){

    storage.init().then(function() {
        storage.setItem('lgip',req.body.ip)
            .then(function() {
                return storage.getItem('lgip')
            })
            .then(function(value) {
                console.log(value);
            })
    });


    res.json(req.body);
});



module.exports = router;
