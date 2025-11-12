if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const local = require("passport-local");
const User = require("./models/user");

const listings = require("./routes/listing");
const reviews = require("./routes/review");
const user = require("./routes/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/TripNest";

async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("✅ Connected to DB"))
    .catch((err) => {
        console.error("❌ DB connection error:", err);
        process.exit(1);
    });

// Middleware & Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

// Root Route
// app.get("/", (req, res) => {
//     res.send("I am root..");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);


// 404 Handler
// Catch-all route
app.use((req, res, next) => {
    next(new expressError(404, "Page Not Found"));
});

// Error Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    let message = err.message || "Something went wrong!";

    // If Joi validation error
    if (err.details) {
        message = err.details.map(el => el.message).join(", ");
    }

    res.status(statusCode).render("error", { err: { statusCode, message } });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080....");
});
