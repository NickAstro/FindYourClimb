var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Location = require("./models/location"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB  = require("./seeds");
    
var commentRoutes = require("./routes/comments"),
    locationRoutes = require("./routes/locations"),
    indexRoutes = require("./routes/index");


// seedDB();

mongoose.connect("mongodb://localhost/find_climb");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//config for passport
app.use(require("express-session")({
    secret: "I'm hungry",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//check for user login/out middleware
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   next();
});

//
app.use(indexRoutes);
app.use("/locations/:id/comments", commentRoutes);
app.use("/locations", locationRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server is up"); 
});