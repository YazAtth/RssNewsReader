const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser'); // Reads from the text box
const fs = require('fs');


router.use(bodyParser.urlencoded({ extended: true })); 



router.get("/", (req, res) => {


    fs.readFile("./clientPreferences.json", "utf-8", (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data)

        // console.log(obj.refreshRateInMinutes);

        res.render("admin", {title: "Admin", pageTitle: "Admin", jsonData:obj})

    })



    // let myText = req.body.mytext;
    // console.log(myText);
})


router.post("/", (req, res) => {


    // Paths to the clientPreference file
    const fileNameTwoDots = '../clientPreferences.json';
    const fileNameOneDot = "./clientPreferences.json";
    const file = require(fileNameTwoDots);

    // Fields to be changed
    file.refreshRateInMinutes = req.body.refreshRate;
    file.sortPreferences.sortByField = req.body.sortField;
    file.sortPreferences.order = req.body.sortOrder;

    console.log("ran");
    console.log(req.body.visibleFeeds);

    for (let i=0; i<file.rssSources.length; i++) {
        if (req.body.visibleFeeds.includes(file.rssSources[i].title)) {
            // console.log(`Found ${file.rssSources[i].title}`);
            file.rssSources[i].isVisible = true
        }
        else {
            file.rssSources[i].isVisible = false
        }
    }

    // Writes to the JSON file
    fs.writeFile(fileNameOneDot, JSON.stringify(file, null, 2), (err) => { // For some reason the first parameter takes one dot before the filename but the "require()" at the top needs 2 dots
        if (err) return console.log(err);
        // console.log("saved");
    });


    res.redirect("/admin");
});


router.get("/sources/delete", (req, res) => {

    fs.readFile("./clientPreferences.json", "utf-8", (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data)

        res.render("sourcesDeleter", {title: "Source Deleter", pageTitle: "Source Deleter", jsonData:obj})
    });
});




router.post("/sources/delete", (req, res) => {

    // Paths to the clientPreference file
    const fileNameTwoDots = '../clientPreferences.json';
    const fileNameOneDot = "./clientPreferences.json";
    const file = require(fileNameTwoDots);


    newRssSourcesList = [];

    console.log(req.body);

    if (req.body.deleteSource != null) { // Only tries to read the response if it is not null (ie. at least one of the checkboxes are checked)
        for (let i=0; i<file.rssSources.length; i++) {

            if (!req.body.deleteSource.includes(file.rssSources[i].title)) {
                newRssSourcesList.push(file.rssSources[i]);
            }
        }

        file.rssSources = newRssSourcesList;
    }


    // Writes to the JSON file
    fs.writeFile(fileNameOneDot, JSON.stringify(file, null, 2), (err) => { // For some reason the first parameter takes one dot before the filename but the "require()" at the top needs 2 dots
        if (err) return console.log(err);
    });
    
    res.redirect("/admin");

})



router.get("/sources/add", (req, res) => {

    fs.readFile("./clientPreferences.json", "utf-8", (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data)

        res.render("sourcesAdder", {title: "Source Adder", pageTitle: "Source Adder", jsonData:obj})
    });

})


router.post("/sources/add", (req, res) => {

    // Paths to the clientPreference file
    const fileNameTwoDots = '../clientPreferences.json';
    const fileNameOneDot = "./clientPreferences.json";
    const file = require(fileNameTwoDots);


    isVisibleBool = true;
    if (req.body.isVisible == null) {
        isVisibleBool = false;
    }

    newsSourceObj = {
        "url": req.body.newsSourceUrl,
        "title": req.body.newsSourceTitle,
        "isVisible": isVisibleBool
    }

    file.rssSources.push(newsSourceObj);

    // Writes to the JSON file
    fs.writeFile(fileNameOneDot, JSON.stringify(file, null, 2), (err) => { // For some reason the first parameter takes one dot before the filename but the "require()" at the top needs 2 dots
        if (err) return console.log(err);
    });
    

    // console.log(newsSourceObj);
    

    res.redirect("/admin")
});


module.exports = router;
