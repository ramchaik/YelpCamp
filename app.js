const express               = require("express"),
      app                   = express(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      flash                 = require("connect-flash"),
      methodOverride        = require("method-override"),
      Campground            = require("./models/campground"),
      Comment               = require("./models/comment"),
      User                  = require("./models/user"),
      seedDb                = require("./seeds"),
      passport              = require("passport"),
      localStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose");

// requiring routes
const   commentRoutes       = require("./routes/comments"),
        campgroundRoutes    = require("./routes/campgrounds"),
        indexRoutes         = require("./routes/index");

// mongoose.connect('mongodb://localhost:27017/yelp_camp_v13', {useCreateIndex: true, useNewUrlParser: true });
mongoose.connect('mongodb+srv://user:mypassword123@cluster0-0c374.mongodb.net/test?retryWrites=true', {useCreateIndex: true, useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDb(); // seed data
        
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Something complex",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to get user state
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("The YelpCamp Server has started..."); 
});