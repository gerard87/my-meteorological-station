module.exports.update_sensor_values = function (io, body) {
    io.sockets.emit('temperature'+body.name, body.temperature);
    io.sockets.emit('humidity'+body.name, body.humidity);
    io.sockets.emit('temperature2'+body.name, body.temperature2);
    io.sockets.emit('pressure'+body.name, body.pressure);
    io.sockets.emit('sealevel_pressure'+body.name, body.sealevel_pressure);
    io.sockets.emit('altitude'+body.name, body.altitude);
};

module.exports.update_api_values = function (io, body) {
    io.sockets.emit('city'+body.name, body.city);
    io.sockets.emit('weather'+body.name, body.weather);
    io.sockets.emit('wind_dir'+body.name, body.wind_dir);
    io.sockets.emit('wind_kph'+body.name, body.wind_kph + ' kph');
    io.sockets.emit('dewpoint_c'+body.name, body.dewpoint_c + ' *C');
    io.sockets.emit('heat_index_c'+body.name, body.heat_index_c + ' *C');
    io.sockets.emit('windchill_c'+body.name, body.windchill_c + ' *C');
    io.sockets.emit('feelslike_c'+body.name, body.feelslike_c + ' *C');
    io.sockets.emit('visibility_km'+body.name, body.visibility_km + ' km');
    io.sockets.emit('precip_today_metric'+body.name, body.precip_today_metric + ' mm');
    io.sockets.emit('icon'+body.name, body.icon);
    io.sockets.emit('icon_url'+body.name, body.icon_url);
};