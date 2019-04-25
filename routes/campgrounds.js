const   express = require("express"),
        router  = express.Router(),
        Campground = require("../models/campground"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware");
        
// INDEX - show all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
       if (err) { 
           console.log(err);
       } else {
           res.render("campground/index", {campgrounds: allCampgrounds});
       }
    });
});

// CREATE - add new campgrounds
router.post("/", middleware.isLogedIn, (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // create a new Campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campground page
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create new campgrounds
router.get("/new", middleware.isLogedIn, (req, res) => {
    res.render("campground/new"); 
});

// SHOW - shows more information about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec( function (err, foundCampground){
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else {
            res.render('campground/show', {campground: foundCampground}); 
        }
    });
});

// EDIT Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
       res.render("campground/edit", {campground: foundCampground});
    });
});

// UPADTE Campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground 
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            // redirect somewhere
            res.redirect(`/campgrounds/${updatedCampground._id}/`);
        }
    });
});

// DESTROY Campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;