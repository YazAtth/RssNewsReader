// Express modules
const express = require("express");
const app = express();
// Express ejs layouts modules
const expressLayouts = require("express-ejs-layouts");

// CONFIG
app.set("view engine", "ejs"); // Allows us to use ejs instead of html files in the views folder
app.use(express.static(__dirname + "/public")); // Makes the "public" folder which contains the css available to the browser.
app.use(expressLayouts);





// ROUTES
const articlesRoute = require("./routes/articles");
app.use("/articles", articlesRoute);


app.get("/", (req, res) => {
    res.render("home", {title: "Home"});
})


app.listen(3001);


