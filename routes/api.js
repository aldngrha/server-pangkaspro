const express = require("express");
const router = express.Router();
const { login, register } = require("../app/api/auth/controller");
const { LandingPage } = require("../app/api/LandingPageAPI");
const { DetailBarbershop } = require("../app/api/DetailBarbershopAPI");

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/landing-page", LandingPage);
router.get("/detail/:id/barbershop", DetailBarbershop);

module.exports = router;
