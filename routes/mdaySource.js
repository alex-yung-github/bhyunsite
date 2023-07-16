const express = require('express');
const mDay_router = express.Router();
const path = require('path')

mDay_router.get('/mday_chang', (req, res) => {
    res.render('mday/mdayPage.ejs')
}) 

module.exports = mDay_router