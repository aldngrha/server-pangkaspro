const express = require("express");
const router = express.Router();
const { login, register } = require("../app/api/auth/controller");
const { LandingPage } = require("../app/api/LandingPageAPI");
const { DetailBarbershop } = require("../app/api/DetailBarbershopAPI");
const { isUser } = require("../middlewares/auth");
const {
  FavoriteBarbershop,
  GetFavBarbershop,
} = require("../app/api/FavoriteAPI");

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/landing-page", LandingPage);
router.get("/detail/:id/barbershop", DetailBarbershop);
router.post("/favorite", isUser, FavoriteBarbershop);
router.get("/favorites", isUser, GetFavBarbershop);

module.exports = router;
