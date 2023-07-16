const express = require('express');
const pers_router = express.Router();

pers_router.get('/aboutMe', (req, res) => {
    res.render('pers/landingPage')
}) 

module.exports = pers_router