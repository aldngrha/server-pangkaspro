const express = require("express");
const router = express.Router();
const {
  login,
  register,
  changePassword,
} = require("../app/api/auth/controller");
const { LandingPage } = require("../app/api/LandingPageAPI");
const { DetailBarbershop } = require("../app/api/DetailBarbershopAPI");
const { isUser } = require("../middlewares/auth");
const {
  FavoriteBarbershop,
  GetFavBarbershop,
  GetOneFavBarbershop,
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
const { AddRating } = require("../app/api/RatingAPI");
const { UpdateUser } = require("../app/api/UserAPI");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/change-password", isUser, changePassword);

router.get("/landing-page", LandingPage);
router.get("/detail/:id/barbershop", DetailBarbershop);

router.post("/favorite/:id", isUser, FavoriteBarbershop);
router.get("/favorite/:id", isUser, GetOneFavBarbershop);
router.get("/favorites", isUser, GetFavBarbershop);

router.get("/transactions", isUser, GetAllTransaction);
router.get("/transaction/:id", isUser, GetOneTransaction);
router.get("/transaction", isUser, GetOngoingTransaction);
router.post("/transaction", isUser, uploadSingle, CreateTransaction);
router.post("/transaction/:id/addons", isUser, AddonsTransaction);

router.get("/invoice/:id/download", GetInvoice);

router.post("/rating/:id/barbershop", isUser, AddRating);

router.patch("/user", isUser, UpdateUser);

module.exports = router;
