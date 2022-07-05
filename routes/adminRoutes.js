const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser'); // Reads from the text box, need it for requests with express
const fs = require('fs');

const fileController = require("../controllers/fileController");

router.use(bodyParser.urlencoded({ extended: true })); // Reads from the text box, need it for requests with express



router.get("/", async (req, res) => {

    jsonObj = await fileController.returnClientPreferences();
    // console.log(jsonObj);

    res.render("admin", {title: "Admin", pageTitle: "Admin", jsonData:jsonObj})

});



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


    // If none of the items are checked, will return "undefined", this makes sure it returns an empty array instead.
    if (req.body.displayElements == null) {
        req.body.displayElements = [];
    }

    // Display Settings...
    if (req.body.displayElements.includes("displaySourceTitle")) {
        file.viewPreferences.displaySourceTitle = true;
    }
    else {
        file.viewPreferences.displaySourceTitle = false;
    }

    if (req.body.displayElements.includes("displayDescription")) {
        file.viewPreferences.displayArticleDescription = true;
    } else {
        file.viewPreferences.displayArticleDescription = false;
    }

    // Writes to the JSON file
    fs.writeFile(fileNameOneDot, JSON.stringify(file, null, 2), (err) => { // For some reason the first parameter takes one dot before the filename but the "require()" at the top needs 2 dots
        if (err) return console.log(err);
        // console.log("saved");
    });


    res.redirect("/admin");
});


router.get("/sources/delete", async (req, res) => {
    obj = await fileController.returnClientPreferences();
    console.log(jsonObj);

    res.render("sourcesDeleter", {title: "Source Deleter", pageTitle: "Source Deleter", jsonData:obj})
});




router.post("/sources/delete", (req, res) => {

    // Paths to the clientPreference file
    const fileNameTwoDots = '../clientPreferences.json';
    const fileNameOneDot = "./clientPreferences.json";
    const file = require(fileNameTwoDots);


    newRssSourcesList = [];

    if (req.body.deleteSource != null) { // Only tries to read the response if it is not null (ie. at least one of the checkboxes are checked)
        for (let i=0; i<file.rssSources.length; i++) {

            // Checks to see if the response doesn't contain a source with the same "title" and "extra" info and then adds it to the list "newRssSourcesList"
            if (!req.body.deleteSource.includes(`${file.rssSources[i].title}_${file.rssSources[i].extraInfo}`)) {
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

    // console.log(req.body);

    newsSourceObj = {
        "url": req.body.newsSourceUrl,
        "title": req.body.newsSourceTitle,
        "extraInfo": req.body.newsSourceExtraInfo,
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

router.get("/users/add", async (req, res) => {

    jsonObj = await fileController.returnClientPreferences();

    res.render("userAdder", {title: "Add User", pageTitle: "Add User", jsonData:obj})
})

router.post("/users/add", (req, res) => {

    // console.log(req.body);

    adminAccessBool = false;
    if (req.body.isAdmin == "on") {
        adminAccessBool = true;
    }

    newObj = {
        "clientDetails": {
            "userName": req.body.userName,
            "userKey": req.body.userKey,
            "adminAccess": adminAccessBool
        },
        "refreshRateInMinutes": "15",
        "rssSources": [
            {
            "url": "https://www.theguardian.com/international/rss",
            "title": "The Guardian",
            "extraInfo": "International",
            "isVisible": true
            },
            {
            "url": "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
            "title": "The New York Times",
            "extraInfo": "Home Page",
            "isVisible": true
            },
            {
            "url": "http://feeds.bbci.co.uk/news/england/london/rss.xml",
            "title": "BBC",
            "extraInfo": "London",
            "isVisible": true
            },
            {
            "url": "https://feeds.skynews.com/feeds/rss/home.xml",
            "title": "Sky News",
            "extraInfo": "Home",
            "isVisible": true
            }
        ],
        "filterPreferences": {
            "showInFeed": [
            "The Guardian",
            "The New York Times",
            "BBC",
            "Sky News"
            ],
            "requiredKeywords": {
            "requireAtLeastOneItem": [],
            "requireAllItems": [],
            "excludedItems": []
            }
        },
        "sortPreferences": {
            "sortByField": "pubDate",
            "order": "descending"
        },
        "viewPreferences": {
            "displaySourceTitle": true,
            "displayArticleDescription": true
        }
    }

    path = `./clients/${req.body.userName}.json`
    
    // Stops if the user exists (ie. the file name exists)
    fs.access(path, fs.F_OK, (err) => {
        if (!err) { 
            console.log("File exists"); 
        } 
        else {
            console.log("File doesn't exist");

            fs.writeFile(path, JSON.stringify(newObj, null, 2), (err) => { // For some reason the first parameter takes one dot before the filename but the "require()" at the top needs 2 dots
                if (err) return console.log(err);
            });

    
        }
    });

    console.log(newObj);

    res.redirect("/admin/users/add");

})

module.exports = router;
