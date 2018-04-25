var express = require("express");
//mergeParams in order to pass req.params.id
var router = express.Router({mergeParams: true});

//it's looking for index.js in here
var middleware = require("../middleware");

var Location = require("../models/location");
var Comment = require("../models/comment");

//comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find location by id
    Location.findById(req.params.id, function(err, location) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {location: location}); 
       }
    });
   
});

//create comment
router.post("/", middleware.isLoggedIn, function(req, res) {
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
                   comment.author.id = req.user._id;
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

//edit comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    var location_id = req.params.id;
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect("back");    
        } else {
            res.render("comments/edit", {location_id: location_id, comment: foundComment});
        }
    });
    
});

//update route for comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/locations/" + req.params.id);
        }
    });  
});

//Destroy comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   //find and remove 
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back");
        }else{
            res.redirect("/locations/" + req.params.id);
        }
    })
});




module.exports = router;