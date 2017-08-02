const express = require('express');
const router = express.Router();

const { twitter } = require('../twitter');

router.post('/', function(req, res){

    twitter.tweetUpdate();
    res.end();

});


module.exports = router;