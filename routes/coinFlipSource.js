const express = require('express');
const coinflip_router = express.Router();

coinflip_router.get('/coinFlip1', (req, res)=>{
    let val = Math.floor(Math.random() * 2);
    const render_dictionary = {
        'val': val,
        'guess': 0
    }
    res.render('coinflip', render_dictionary)
})

coinflip_router.get('/coinFlip2', (req, res)=>{
    let val = Math.floor(Math.random() * 2);
    const render_dictionary = {
        'val': val,
        'guess': 1
    }
    res.render('coinflip', render_dictionary)
})

module.exports = coinflip_router
