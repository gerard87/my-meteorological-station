var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');
var storage = require('node-persist');
var init_values = require('./public/js/init_values');
var sockets = require('./public/js/sockets');
var env = process.env.NODE_ENV || 'development';

var sensors_array = [];
var coords = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
storage.initSync();

app.get('/', function(req, res){

    var api_data = storage.getItemSync('apiData');
    var sensors_data = storage.getItemSync('sensorsData');

    if (api_data === undefined) {
        api_data = init_values.api_init_values;
    } else {
        coords = [api_data['longitude'], api_data['latitude']];
    }

    if (sensors_data === undefined) {
        sensors_data = init_values.sensors_init_values;
    } else {
        sensors_array = [sensors_data['temperature'], sensors_data['humidity'], sensors_data['temperature2'],
            sensors_data['pressure'], sensors_data['sealevel_pressure'], sensors_data['altitude']];
    }

    res.render('index',{
        title: 'My Meteorological Station',
        api_data: api_data,
        sensors_data: sensors_data,
        env: env
    });
});

app.post('/sensors', function(req, res){
    // console.log(req.body);

    sockets.update_sensor_values(io, req.body);

    sensors_array = [req.body.temperature, req.body.humidity, req.body.temperature2,
        req.body.pressure, req.body.sealevel_pressure, req.body.altitude];

    storage.setItemSync('sensorsData', req.body);

    res.json(req.body);
});

app.post('/api', function(req, res){
    // console.log(req.body);

    sockets.update_api_values(io, req.body);

    coords = [req.body.longitude, req.body.latitude];

    storage.setItemSync('apiData', req.body);

    res.json(req.body);
});

app.post('/lg', function (req, res){

    var options = {
        mode: 'text',
        args: [req.body.city, coords, sensors_array]
    };

    PythonShell.run('./scripts/lg-scripts/lgComm.py', options, function (err, results) {
        if(err)console.log(err);
        console.log(results);
    });
});


http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});