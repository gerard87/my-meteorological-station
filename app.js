const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const bodyParser = require('body-parser');

const admin = require("firebase-admin");
const config = require('./firebase-config.json');
const serviceAccount = require("./firebase-admin.json");

const { twitter } = require('./twitter');

const { home, assistant, liquidgalaxy, tweet, configuration, physicalweb } = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/', configuration);
app.use('/', liquidgalaxy);
app.use('/', assistant);
app.use('/', tweet);
app.use('/', physicalweb);



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.databaseURL
});

// Tweet the update every 24 hours
setInterval(twitter.tweetUpdate, 86400000);


http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});

module.exports = app;