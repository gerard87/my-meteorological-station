module.exports.update_sensor_values = function (io, body) {
    io.sockets.emit('temperature'+body.name, body.temperature);
    io.sockets.emit('humidity'+body.name, body.humidity);
    io.sockets.emit('temperature2'+body.name, body.temperature2);
    io.sockets.emit('pressure'+body.name, body.pressure);
    io.sockets.emit('sealevel_pressure'+body.name, body.sealevel_pressure);
    io.sockets.emit('altitude'+body.name, body.altitude);
};

module.exports.update_api_values = function (io, body) {
    io.sockets.emit('city', body.city);
    io.sockets.emit('weather', body.weather);
    io.sockets.emit('wind_dir', body.wind_dir);
    io.sockets.emit('wind_kph', body.wind_kph + ' kph');
    io.sockets.emit('dewpoint_c', body.dewpoint_c + ' *C');
    io.sockets.emit('heat_index_c', body.heat_index_c + ' *C');
    io.sockets.emit('windchill_c', body.windchill_c + ' *C');
    io.sockets.emit('feelslike_c', body.feelslike_c + ' *C');
    io.sockets.emit('visibility_km', body.visibility_km + ' km');
    io.sockets.emit('precip_today_metric', body.precip_today_metric + ' mm');
    io.sockets.emit('icon', body.icon);
    io.sockets.emit('icon_url', body.icon_url);
};