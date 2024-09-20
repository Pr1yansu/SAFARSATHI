const express = require("express");
const router = express.Router();
const { getAllCountries } = require("../controllers/country-data.controller");

router.get("/", getAllCountries);

module.exports = router;
