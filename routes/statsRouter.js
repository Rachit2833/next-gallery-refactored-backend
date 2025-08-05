const express = require('express');
const {  getAllCountries } = require('../controller/statsController');
const router= express.Router()
// router.route("/images").get(getImageStats);
router.route("/countries").get(getAllCountries);
module.exports=router