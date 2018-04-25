var middlewareObj = {};

var Location = require("../models/location");
var Comment = require("../models/comment");

middlewareObj.checkLocationOwnership = function(req, res, next) {
    //ensure authorized user allowed to edit
    if(req.isAuthenticated()){
        Location.findById(req.params.id, function(err, foundLocation){
            if(err) {
                req.flash("error", "Something went wrong");
                res.redirect("back");
            } else {
                //check if they own location.
                if(foundLocation.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //ensure authorized user allowed to edit
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back");
            } else {
                //check if they own comment.
                if(foundComment.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    req.flash("error", "You don't have permission");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash("error", "Please Login First.");
        res.redirect("/login");
    }
};


module.exports = middlewareObj;