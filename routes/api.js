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
const {
  CreateTransaction,
  AddonsTransaction,
  GetAllTransaction,
  GetOneTransaction,
  GetOngoingTransaction,
} = require("../app/api/TransactionAPI");
const { uploadSingle } = require("../middlewares/multer");
const { GetInvoice } = require("../app/api/InvoiceAPI");
const { Router } = require("express");
const { AddRating } = require("../app/api/RatingAPI");

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/landing-page", LandingPage);
router.get("/detail/:id/barbershop", DetailBarbershop);

router.post("/favorite/:id", isUser, FavoriteBarbershop);
router.get("/favorites", isUser, GetFavBarbershop);

router.get("/transactions", isUser, GetAllTransaction);
router.get("/transaction/:id", isUser, GetOneTransaction);
router.get("/transaction", isUser, GetOngoingTransaction);
router.post("/transaction", isUser, uploadSingle, CreateTransaction);
router.post("/transaction/:id/addons", isUser, AddonsTransaction);

router.get("/invoice/:id/download", isUser, GetInvoice);

router.post("/rating/:id/barbershop", isUser, AddRating);

module.exports = router;
