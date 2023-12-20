const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  // console.log(listing.location);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review added");

  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted");

  res.redirect(`/listings/${id}`);
};
