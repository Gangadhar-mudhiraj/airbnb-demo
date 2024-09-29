const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const mbxgeCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxgeCoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewform = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Lising you requisted does not exist");
    res.redirect("/listings");
  } else {
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
  }
};

module.exports.createNewListing = async (req, res, next) => {
  let response;
  let geometry = {}; // Initialize empty geometry object

  try {
    // Try to perform geocoding
    response = await geoCodingClient
      .forwardGeocode({
        query: req.body.listing.location, // Get location from form
        limit: 1,
      })
      .send();

    if (response.body.features.length) {
      // If a valid location is found, extract the geometry
      geometry = response.body.features[0].geometry;
    } else {
      // If no location is found, notify the user but proceed with saving the listing
      req.flash("error", "Invalid location, but listing will still be saved.");
    }
  } catch (e) {
    // If geocoding or authentication fails, flash an error but proceed
    req.flash("error", "Geocoding failed. Listing will be saved without location data.");
  }

  // Process image upload
  let url = req.file.path;
  let filename = req.file.filename;

  // Create the new listing with form data
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Associate the listing with the logged-in user
  newListing.image = { url, filename };
  
  // Only save geometry if geocoding was successful, otherwise leave it empty
  newListing.geometry = geometry;

  await newListing.save(); // Save the listing to the database

  req.flash("success", "New listing added"); // Notify user of success
  res.redirect("/listings"); // Redirect to listings page
};



module.exports.renderEdit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing does not exist");
    res.redirect("/listings");
  } else {
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/h_200,w_300"
    );
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
  }
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted");
  res.redirect("/listings");
};
