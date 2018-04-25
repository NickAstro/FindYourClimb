var express = require("express");
//mergeParams in order to pass req.params.id
var router = express.Router({mergeParams: true});


var Location = require("../models/location");
var Comment = require("../models/comment");

//comments
router.get("/new", isLoggedIn, function(req, res) {
    //find location by id
    Location.findById(req.params.id, function(err, location) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {location: location}); 
       }
    });
   
});

router.post("/", isLoggedIn, function(req, res) {
    //get location by id
    Location.findById(req.params.id, function(err, location) {
        if(err) {
            console.log(err);
            res.redirect("/locations");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
               if(err) {
                   console.log(err);
               } 
               else {
                   //add username and id to comment
                   comment.author.id = req.user_id;
                   comment.author.username = req.user.username;
                   comment.save();
                   location.comments.push(comment);
                   location.save();
                   res.redirect("/locations/" + location._id);
               }
            });
        }
    });
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