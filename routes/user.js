const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Define a new route for "/"
router.route("/")
  .get(userController.renderLoginForm) // Assuming renderLoginForm handles the rendering of login form
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/",
      failureFlash: true,
    }),
    userController.login
  );

// Existing routes for "/signup" and "/login"
router
  .route("/signup")
  .get(userController.renderSingupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// Logout route
router.get("/logout", userController.logout);

module.exports = router;
