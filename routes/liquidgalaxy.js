const express = require('express');
const router = express.Router();

const { lg } = require('../liquidgalaxy');
const  { firebase } = require('../firebase');

router.post('/', function (req, res){

    if (req.body.stop === 'true') {

        //lg.exit_tour();
        lg.clean_lg();

    } else {

        firebase.readStationData(req.body.name).then(data => {

            lg.flyTo(data.city);
            lg.show_kml_balloon(data);

        });

    }
    res.end();

});

module.exports = router;