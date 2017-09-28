var express     = require("express"),
      app       = express(),
     bodyParser = require("body-parser"),
      mongoose  = require("mongoose"),
      flash     = require("connect-flash"),
      passport  = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
     Campground = require("./models/campground"),
     Comment    = require("./models/comment"),
        User    = require("./models/user"),
      seedDB    = require("./seeds")
      
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes  = require("./routes/index")
    
var url = process.env.DATABASEURL || ("mongodb://localhost/yelp_camp_v12", {useMongoClient: true});
mongoose.connect(url);
mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});
// mongoose.connect("mongodb://neel:rusty@ds157479.mlab.com:57479/yelpcamp", {useMongoClient: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + `/public`));
app.use(methodOverride("_method"));
app.use(flash());
// seed the Database // seedDB(); 

// PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "Once again rusty is the cutest dog!",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
 res.locals.currentUser = req.user;
 res.locals.error = req.flash("error");
 res.locals.success = req.flash("success");
 next();
});

// REQURING Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
   
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Camp Site Server has started") 
});