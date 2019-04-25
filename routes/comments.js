const   express = require("express"),
        router  = express.Router({mergeParams: true}),
        Campground = require("../models/campground"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware");
        
// Comments New
router.get('/new', middleware.isLogedIn, (req, res) => {
    Campground.findById(req.params.id , (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comment/new", {campground: campground});
        }
    })
});

// Comments Create
router.post('/', middleware.isLogedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
          res.redirect(`/campgrounds`);
      } else {
          Comment.create(req.body.comment, (err, comment) => {
              if(err) {
                  console.log(err);
              } else {
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success", "Successfully added comment");
                  res.redirect(`/campgrounds/${campground._id}`);
              }
          })
      }
    });   
});

// Comments EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comment/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
    });
});

// Comments UPDATE 
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Comments DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    // find by ID and Remove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            // redirect to page
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;