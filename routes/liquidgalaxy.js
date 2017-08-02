const express = require('express');
const router = express.Router();

const { lg } = require('../liquidgalaxy');

router.post('/', function (req, res){

    if (req.body.stop === 'true') {
        lg.exit_tour();
        lg.clean_lg();
    } else {
        const sensors_array = [req.body.temperature, req.body.humidity, req.body.temperature2,
            req.body.pressure, req.body.sealevel_pressure, req.body.altitude];
        const coords = [req.body.longitude, req.body.latitude];

        lg.show_kml_balloon(req.body.city, coords, sensors_array);
    }
    res.end();

});

module.exports = router;