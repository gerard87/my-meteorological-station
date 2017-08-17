const Twit = require('twit');
const twitterConfig = require('../twitter-config.json');

const { firebase } = require('../firebase');

const twitter = new Twit(twitterConfig);


function tweetUpdate () {

    firebase.readStations().then(data => {

        for (const station in data) {

            const msg = data[station].name + ': ' + data[station].alias +' \n' +
                'City: ' + data[station].city + '\n' +
                'Weather: ' + data[station].weather + '\n' +
                'Temperature: ' + data[station].temperature + ' ºC\n' +
                'Humidity: ' + data[station].humidity + ' %\n' +
                'Pressure: ' + data[station].pressure + ' Pa\n' +
                'Sea level pressure: ' + data[station].sealevel_pressure + ' Pa\n';


            twitter.post('statuses/update', {status: msg}, function (err, data, response) {
                console.log(data);
            });

        }
    });



}


module.exports = {
    tweetUpdate
};
