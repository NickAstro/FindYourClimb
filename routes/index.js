var express = require("express");
var router = express.Router();

var User = require("../models/user");
var passport = require("passport");


router.get("/", function(req, res) {
   res.render("landing"); 
});



//auth routes
router.get("/register", function(req, res) {
    res.render("register");    
    
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            return res.render("register", {"error": err.message});
        } else{
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome, " + user.username);
                res.redirect("/locations"); 
            });
            
        }
    });    
});
//login form
router.get("/login", function(req, res) {
   res.render("login"); 
});
//handling login with middleware
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/locations", 
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "You are logged out.");
    res.redirect("/locations");
});


//middleware for is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = router;