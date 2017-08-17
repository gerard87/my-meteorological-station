const express = require('express');
const router = express.Router();

const UrlShorter = require('isgd');
const env = process.env.NODE_ENV || 'development';

const  { firebase } = require('../firebase');
const config = require('../firebase-config.json');



router.get('/pw/', function (req, res){

    res.render('physicalweb', {
        title: 'Physical web',
        config: config,
        env: env,
        id: req.query.id
    });
});


router.get('/pw/new', function (req, res){

    firebase.readStations().then( data => {

        res.render('newbeacon', {
            title: 'New beacon',
            data: data,
            config: config,
            env: env,
            id: req.query.id
        });

    });


});



router.get('/pw/manage', function(req, res){

    firebase.getUserBeacons(req.query.id).then(data => {

        res.render('managebeacons', {
            title: 'Manage beacons',
            data: data,
            config: config,
            id: req.query.id,
            env: env
        });

    });


});


router.get('/pw/:id/edit', function(req, res){

    firebase.getBeacon(req.params.id).then(data => {

        firebase.readStations().then(stations => {

            res.render('editbeacon', {
                title: 'Edit beacon',
                data: data,
                stations: stations,
                config: config,
                id: req.params.id,
                env: env
            });

        });



    });


});


router.get('/pw/url/:uid', function (req, res){

    const id = firebase.createBeacon (req.query.name ,req.params.uid, req.query.station);

    const longUrl = 'https://mymeteorologicalstation.appspot.com/pw/' + id.key;

    UrlShorter.shorten(longUrl, url => {

        id.update({url: url});

        res.render('geturl', {
            title: 'URL',
            url: url,
            config: config,
            env: env,
            id: req.params.uid
        });
    });


});

router.get('/pw/:id', function (req, res){

    firebase.getBeacon(req.params.id).then(data => {
        res.render('pwcontent', {
            title: 'My meteorological station',
            description: 'There is a nearby station! Touch to open.',
            url: 'https://mymeteorologicalstation.appspot.com/#' + data.station
        });
    });



});


module.exports = router;