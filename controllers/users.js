const User = require("../models/user.js");

module.exports.signup = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    let nUser = new User({ email, username });
    const reUser = await User.register(nUser, password);
    req.login(reUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (er) {
    req.flash("error", er.message);
    res.redirect("/signup");
  }
};

module.exports.renderSingupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome successfully loged in");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully logged out");
    res.redirect("/listings");
  });
};
