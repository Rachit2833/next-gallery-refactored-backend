const express = require('express');
const { getImageStats, getAllCountries } = require('../controller/statsController');
const { searchThrottle } = require('../middleware/imageMiddleWare');
const router= express.Router()
router.route("/images").get(getImageStats);
router.route("/countries").get(getAllCountries);
module.exports=router