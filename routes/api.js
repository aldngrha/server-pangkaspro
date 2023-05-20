const express = require("express");
const router = express.Router();
const { login, register } = require("../app/api/auth/controller");
const { LandingPage } = require("../app/api/LandingPageAPI");

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/landing-page", LandingPage);

module.exports = router;
