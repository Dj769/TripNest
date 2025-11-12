const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/TripNest";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68cecba9c25bbdcbbce26af0"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialzed..");
};

initDB();