const express = require('express');
const router = express.Router();

const { assistant } = require('../assistant');

router.post('/assistant', function(req, res){

    assistant.webhook(req, res);

});


module.exports = router;