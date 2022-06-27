// Express modules
const express = require("express");
const app = express();
// Express ejs layouts modules
const expressLayouts = require("express-ejs-layouts");
// Mongoose
const mongoose = require("mongoose");

const PORT = 3001;

// CONFIG
app.set("view engine", "ejs"); // Allows us to use ejs instead of html files in the views folder
app.use(express.static(__dirname + "/public")); // Makes the "public" folder which contains the css available to the browser.
app.use(expressLayouts);
require("dotenv/config")







// ROUTES
const articlesRoute = require("./routes/articlesRoutes");
app.use("/articles", articlesRoute);

const adminRoute = require("./routes/adminRoutes");
app.use("/admin", adminRoute);



app.get("/", (req, res) => {
    res.render("home", {title: "Home", pageTitle: "Home"});
})


// Connect to DB
// First argument is the Mongoose URI which is held in the .env file
// Ensure you put the Collection Name before the ? in the URI 
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log("Connected to DB!");
})

app.listen(PORT, "localhost", () => {
    console.log(`Server active at --> http://localhost:${PORT}`);
});







