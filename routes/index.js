const express = require("express");
const Dashboard = require("../app/cms/dashboard");
const Barber = require("../app/cms/barber");
const router = express.Router();

/* GET home page. */
router.get("/dashboard", Dashboard.dashboard);

router.get("/barber", Barber.index);

module.exports = router;
