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
            id: req.query.id
        });

    });


});


router.get('/createform', function(req, res){

    res.render('createform', {
        title: 'Station configuration',
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
