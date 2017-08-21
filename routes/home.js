const express = require('express');
const router = express.Router();

const storage = require('node-persist');

const { firebase } = require('../firebase');
const config = require('../firebase-config.json');
const mapskey = require('../maps-key.json');

const env = process.env.NODE_ENV || 'development';


router.get('/', function(req, res){

    firebase.readStations().then( data => {

        res.render('index',{
            title: 'Home',
            data: data,
            env: env,
            config: config,
            id: req.query.id
        });

    });


});


router.get('/new', function(req, res){

    res.render('newStation', {
        title: 'New station',
        config: config,
        id: req.query.id
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
        config: config,
        mapskey: mapskey.apikey,
        id: req.query.id
    });

});


router.get('/editform', function(req, res){

    res.render('editform', {
        title: 'Station edit',
        config: config,
        station: req.query.station,
        mapskey: mapskey.apikey,
        id: req.query.id
    });

});


router.get('/settings', function(req, res){

    storage.initSync();
    data = storage.getItemSync('lgsettings');

    if (data === undefined) {
        data = {ip:'', pass:''};
    }

    res.render('settings', {
        title: 'Settings',
        config: config,
        lgip: data.ip,
        lgpass: data.pass,
        id: req.query.id
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
        storage.setItem('lgsettings',{
            ip: req.body.ip,
            pass: req.body.pass
        }).then(function() {
            return storage.getItem('lgip')
        }).then(function(value) {
            console.log(value);
        });
    });

    res.json(req.body);
});



module.exports = router;
