const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const bodyParser = require('body-parser');

const index = require('./routes/index');
const assistant = require('./routes/assistant');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/assistant', assistant);


http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});

module.exports = app;