const express = require("express");
const Dashboard = require("../app/cms/dashboard");
const Barber = require("../app/cms/barber");
const Kapster = require("../app/cms/kapster");
const Status = require("../app/cms/status");
const Transaction = require("../app/cms/transaction");
const User = require("../app/cms/user");
const TransactionKapster = require("../app/cms/transaction-kapster");
const Auth = require("../app/cms/auth");
const {
  allRole,
  isBarber,
  isKapster,
  isAdmin,
} = require("../middlewares/auth");
const { uploadMultiple, uploadSingle } = require("../middlewares/multer");
const router = express.Router();

/* GET home page. */
router.get("/", Auth.signin);
router.post("/", Auth.actionSignin);
router.get("/signout", Auth.actionSignout);

router.get("/dashboard", allRole, Dashboard.dashboard);

router.get("/barber", isBarber, Barber.index);
router.get("/barber/create", isBarber, Barber.create);
router.post("/barber/create", uploadMultiple, isBarber, Barber.store);
router.get("/barber/edit/:id", isBarber, Barber.edit);
router.put("/barber/edit/:id", uploadMultiple, isBarber, Barber.update);
router.delete("/barber/:id/delete", isBarber, Barber.delete);

router.get("/kapster", isBarber, Kapster.index);
router.get("/kapster/create", isBarber, Kapster.create);
router.post("/kapster/create", uploadSingle, isBarber, Kapster.store);
router.get("/kapster/edit/:id", isBarber, Kapster.edit);
router.put("/kapster/edit/:id", uploadSingle, isBarber, Kapster.update);
router.delete("/kapster/:id/delete", isBarber, Kapster.delete);

router.get("/status", isBarber, Status.index);
router.get("/status/create", isBarber, Status.create);
router.post("/status/create", isBarber, Status.store);
router.get("/status/edit/:id", isBarber, Status.edit);
router.post("/status/edit/:id", isBarber, Status.update);

router.get("/transaction", isBarber, Transaction.index);
router.get("/transaction/:id", isBarber, Transaction.detail);
router.post("/transaction/accept/:id", isBarber, Transaction.acceptOrder);
router.post("/transaction/reject/:id", isBarber, Transaction.rejectOrder);
router.put(
  "/transaction/approve-addons/:id",
  isBarber,
  Transaction.approveAddons
);
router.put(
  "/transaction/decline-addons/:id",
  isBarber,
  Transaction.declineAddons
);

router.get("/transactions", isAdmin, Transaction.indexAdmin);
router.get("/transactions/:id", isAdmin, Transaction.detailAdmin);

router.get("/cash-on-delivery", isKapster, TransactionKapster.index);
router.get("/cash-on-delivery/:id", isKapster, TransactionKapster.detail);
router.put(
  "/cash-on-delivery/approve-addons/:id",
  isKapster,
  TransactionKapster.approveAddons
);
router.put(
  "/cash-on-delivery/decline-addons/:id",
  isKapster,
  TransactionKapster.declineAddons
);

router.get("/user", isAdmin, User.index);
router.get("/user/create", isAdmin, User.create);
router.post("/user/create", isAdmin, User.store);
router.get("/user/edit/:id", isAdmin, User.edit);
router.put("/user/edit/:id", isAdmin, User.update);

module.exports = router;
