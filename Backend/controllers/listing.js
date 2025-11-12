const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.newForm = (req, res) => {
    res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate({
        path: "reviews",
        populate: { path: "author" }   
    }).populate("owner");
    if (!listing){
        req.flash("error", "Does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner =req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new expressError(404, "Listing not found");
    if (!listing){
        req.flash("error", "Does not exist!");
        res.redirect("/listings");
    }

    let original = listing.image.url;
    original = original.replace("/upload", "/upload/ w_150");
    res.render("listings/edit", { listing, original });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    return res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) throw new expressError(404, "Listing not found");
    req.flash("success", "Listing Deleted!");
    console.log("Deleted:", deletedListing);
    res.redirect("/listings");
}