var express = require("express");
var router = express.Router();

var Location = require("../models/location");

router.get("/", function(req, res) {
    
    //get locations
    Location.find({}, function(err, allLocations){
       if(err) {
           console.log(err);
       } else {
           res.render("locations/index", {locations:allLocations, currentUser: req.user});
       }
    });
});

router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    //grab user name
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newSite = {name: name, image: image, description: description, author: author};
    //create new location
    Location.create(newSite, function(err, newLocation) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/locations");
        }
    });

});

router.get("/new", isLoggedIn, function(req, res) {
   res.render("locations/new"); 
   
});

router.get("/:id", function(req, res){
    //find location by mongodb id
    Location.findById(req.params.id).populate("comments").exec(function(err, foundLocation) {
       if(err) {
           console.log(err);
       } else {
           //render that unique page
            res.render("locations/show", {location: foundLocation});
       }
    });
    
});

//edit route
router.get("/:id/edit", checkLocationOwnership, function(req, res) {

    Location.findById(req.params.id, function(err, foundLocation){
        if(err) {
            res.redirect("/locations");
        } else {
            res.render("locations/edit", {location: foundLocation}); 
        }
    });
});

// update route
router.put("/:id", checkLocationOwnership, function(req, res){
   //find and update
   Location.findByIdAndUpdate(req.params.id, req.body.location, function(err, updatedLoc){
        if(err) {
            res.redirect("/locations");
        } else {
            //redirect
            res.redirect("/locations/" + req.params.id);
        }
   });
   
});


//destroy route
router.delete("/:id", checkLocationOwnership, function(req, res) {
    Location.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/locations");
        } else {
            res.redirect("/locations");
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

function checkLocationOwnership(req, res, next) {
    //ensure authorized user allowed to edit
    if(req.isAuthenticated()){
        Location.findById(req.params.id, function(err, foundLocation){
            if(err) {
                res.redirect("back");
            } else {
                //check if they own location.
                if(foundLocation.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;