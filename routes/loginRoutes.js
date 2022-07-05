const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser'); // Reads from the text box, need it for requests with express
const fs = require("fs");



const fileController = require("../controllers/fileController");
router.use(bodyParser.urlencoded({ extended: true })); // Reads from the text box, need it for requests with express



router.get("/", async (req, res) => {
    obj = await fileController.returnClientPreferences();

    res.render("login.ejs", {title: "Login", pageTitle: "Login", jsonData:obj})
})



router.post("/", (req, res) => {
    // console.log(req.body.userKey);

    // Paths to the clientPreference file
    const fileNameTwoDots = '../clientPreferences.json';
    const fileNameOneDot = "./clientPreferences.json";
    let file = require(fileNameTwoDots);

        // Loops through userKey for every file in "clients" directory and if a matching one is found: copies and pastes the content in that file into "clientPreferences.json"
    fs.readdirSync("./clients").forEach(client => {
        fs.readFile(`./clients/${client}`, "utf-8", (err, data) => {
            if (err) throw err;
            obj = JSON.parse(data);
            existingUserKey = obj.clientDetails.userKey;

            if (req.body.userKey == existingUserKey) {
                file = obj;

                // Writes to the JSON file
                fs.writeFile(fileNameOneDot, JSON.stringify(file, null, 2), (err) => { // For some reason the first parameter takes one dot before the filename but the "require()" at the top needs 2 dots
                    if (err) return console.log(err);
                });

            }
        });
    })



    res.redirect("/login");
})

module.exports = router;