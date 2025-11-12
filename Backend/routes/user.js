const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const renderUser = require("../controllers/users");

router
    .route("/signup")
    .get(renderUser.getSignup)
    .post(wrapAsync(renderUser.postSignup));

router
    .route("/login")
    .get(renderUser.getLogin)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureFlash: true, failureRedirect: "/login"
    }), renderUser.postLogin);

router.get("/logout", renderUser.getLogout);

module.exports = router;