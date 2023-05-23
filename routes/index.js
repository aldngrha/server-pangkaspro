const express = require("express");
const Dashboard = require("../app/cms/dashboard");
const Barber = require("../app/cms/barber");
const Kapster = require("../app/cms/kapster");
const Status = require("../app/cms/status");
const Transaction = require("../app/cms/transaction");
const Auth = require("../app/cms/auth");
const { allRole, isBarber, isKapster } = require("../middlewares/auth");
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

module.exports = router;
