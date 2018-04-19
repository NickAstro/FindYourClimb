var express = require("express");
var app = express();

app.set("view engine", "ejs");

 

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/locations", function(req, res) {
    // initial array of objects - to be converted to DB later
    var locations = [
        {name: "Delaware Rock Gym", image: "http://www.derockgym.com/images/boulder2.jpg"},
        {name: "Philly Rock Gym", image: "https://www.philarockgym.com/wp-content/uploads/Iron_Oaks_Studio_Photos/IOS_prg-eastfalls_09-1024x683.jpg"}
    ]
   res.render("locations", {locations:locations}); 
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server is up"); 
});