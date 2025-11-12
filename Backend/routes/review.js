const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const { reviewSchema } = require("../schema");
const Review = require("../models/review");
const { isLogged , isAuthor, validateReview} = require("../middleware");
const Listing = require("../models/listing");

const renderReview = require("../controllers/review");


router.post("/", isLogged, validateReview, wrapAsync(renderReview.postReview));


router.delete("/:reviewId",isLogged, isAuthor, wrapAsync(renderReview.deleteReview));

module.exports = router;