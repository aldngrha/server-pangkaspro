const express = require("express");
const Dashboard = require("../app/cms/dashboard");
const Barber = require("../app/cms/barber");
const Auth = require("../app/cms/auth");
const { allRole, isBarber } = require("../middlewares/auth");
const router = express.Router();

/* GET home page. */
router.get("/", Auth.signin);
router.post("/", Auth.actionSignin);
router.get("/signout", Auth.actionSignout);

router.get("/dashboard", allRole, Dashboard.dashboard);

router.get("/barber", isBarber, Barber.index);
router.get("/barber/create", isBarber, Barber.create);
router.get("/barber/edit", isBarber, Barber.edit);

module.exports = router;
