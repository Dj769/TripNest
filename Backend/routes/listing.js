const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const { listingSchema } = require("../schema");
const Listing = require("../models/listing");
const {isLogged, isOwner, validateListing} = require("../middleware");
const listingController = require("../controllers/listing");
const multer = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });


router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLogged, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));


// New Form
router.get("/new", isLogged, listingController.newForm);

// Show
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLogged, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLogged, isOwner, wrapAsync(listingController.deleteListing));


// Edit Form
router.get("/:id/edit", isLogged, isOwner, wrapAsync(listingController.editListing));


module.exports = router;