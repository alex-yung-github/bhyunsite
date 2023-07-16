const express = require('express');
const numberForm_router = express.Router();

numberForm_router.get('/numberForm', (req, res) => {
    res.render('numberForm/landingPage')
}) 
    
numberForm_router.get('/numbers/:numba', (req, res) => {
    const { numba } = req.params
    if(req.query.format == 'json'){
        res.json({
      number : numba,
      notUsedSecret : parseInt(numba)+273,
      toeNumber: parseInt(numba) * 5,
      beardSeconds : parseInt(numba) * 6.096e+7, 
      mickeys : parseInt(numba) * 2400, 
      meters :(parseInt(numba) /3.281), 
      miles :(parseInt(numba)/5280)
        })
    }
    res.render('numberForm/userPage',{
      a : numba,
      b : parseInt(numba)+273,
      c : parseInt(numba) * 5,
      d : parseInt(numba) * 6.096e+7, 
      e : parseInt(numba) * 2400, 
      f :(parseInt(numba) /3.281), 
      g :(parseInt(numba)/5280)
    });
})

numberForm_router.get('/numbers/', (req, res) => {
    let thing = req.query.nm
    // console.log(thing)
    url = thing.toString()
    // console.log(url)
    res.redirect(url)
})


module.exports = numberForm_router