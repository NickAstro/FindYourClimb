var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// initial array of objects - to be converted to DB later
var locations = [
    {name: "Delaware Rock Gym", image: "http://www.derockgym.com/images/boulder2.jpg"},
    {name: "Philly Rock Gym", image: "https://www.philarockgym.com/wp-content/uploads/Iron_Oaks_Studio_Photos/IOS_prg-eastfalls_09-1024x683.jpg"},
    {name: "Delaware Rock Gym", image: "http://www.derockgym.com/images/boulder2.jpg"},
    {name: "Philly Rock Gym", image: "https://www.philarockgym.com/wp-content/uploads/Iron_Oaks_Studio_Photos/IOS_prg-eastfalls_09-1024x683.jpg"},
    {name: "Delaware Rock Gym", image: "http://www.derockgym.com/images/boulder2.jpg"},
    {name: "Philly Rock Gym", image: "https://www.philarockgym.com/wp-content/uploads/Iron_Oaks_Studio_Photos/IOS_prg-eastfalls_09-1024x683.jpg"},
    
]

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/locations", function(req, res) {

   res.render("locations", {locations:locations}); 
});

app.post("/locations", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newSite = {name: name, image: image};
    locations.push(newSite);
    res.redirect("/locations");
    
});

app.get("/locations/new", function(req, res) {
   res.render("new"); 
   
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server is up"); 
});