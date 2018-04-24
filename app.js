var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Location = require("./models/location"),
    Comment = require("./models/comment"),
    seedDB  = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/find_climb");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/locations", function(req, res) {
    //get locations
    Location.find({}, function(err, allLocations){
       if(err) {
           console.log(err);
       } else {
           res.render("locations/index", {locations:allLocations});
       }
    });
});

app.post("/locations", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newSite = {name: name, image: image, description: description};
    //create new location
    Location.create(newSite, function(err, newLocation) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/locations");
        }
    });

});

app.get("/locations/new", function(req, res) {
   res.render("locations/new"); 
   
});

app.get("/locations/:id", function(req, res){
    //find location by mongodb id
    Location.findById(req.params.id).populate("comments").exec(function(err, foundLocation) {
       if(err) {
           console.log(err);
       } else {
           //render that unique page
            res.render("locations/show", {location: foundLocation});
       }
    });
    
})

//comments
app.get("/locations/:id/comments/new", function(req, res) {
    //find location by id
    Location.findById(req.params.id, function(err, location) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {location: location}); 
       }
    });
   
});

app.post("/locations/:id/comments", function(req, res) {
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
                   location.comments.push(comment);
                   location.save();
                   res.redirect("/locations/" + location._id);
               }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server is up"); 
});