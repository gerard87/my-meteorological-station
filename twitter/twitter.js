const Twit = require('twit');
const twitterConfig = require('../twitter-config.json');

const admin = require("firebase-admin");

const twitter = new Twit(twitterConfig);


function tweetUpdate () {

    admin.database().ref('/stations/').once('value').then(function(snapshot) {

        for (const station in snapshot.val()) {

            const msg = station + ' \n' +
                    'City: ' + snapshot.child(station).child('city').val() + '\n' +
                    'Weather: ' + snapshot.child(station).child('weather').val() + '\n' +
                    'Temperature: ' + snapshot.child(station).child('temperature').val() + ' ºC\n' +
                    'Humidity: ' + snapshot.child(station).child('humidity').val() + ' %\n' +
                    'Pressure: ' + snapshot.child(station).child('pressure').val() + ' Pa\n' +
                    'Sea level pressure: ' + snapshot.child(station).child('sealevel_pressure').val() + ' Pa\n';

            twitter.post('statuses/update', {status: msg}, function (err, data, response) {
                console.log(data);
            });

        }


    });



}


module.exports = {
    tweetUpdate
};
