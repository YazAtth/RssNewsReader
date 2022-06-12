const { clearCache } = require("ejs");
const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const fs = require("fs");
const { exit } = require("process");  // Temporary for debugging


const requestsController = require("../controllers/requestsController");
const Article = require("../models/Article"); // Import schema for each Article for the db

// Takes the URLs from the JSON file and turns them into an array
newsFeedSources = JSON.parse(fs.readFileSync("newsSourceList.json"));
jsonUrlList = newsFeedSources.urls;
apiUrlList = [];
for (let i=0; i<jsonUrlList.length; i++) {
    apiUrlList.push(jsonUrlList[i]);
}

lastUpdated = undefined;  // Displayed to the user to show when the news feed was last updated (eg. 14 minutes ago)


// Makes requests and updates database every 15 minutes
// schedule.scheduleJob("*/15 * * * *", async () => {
schedule.scheduleJob("*/30 * * * * *", async () => {
    console.log("Started schedule");

    promiseList = [];

    for (let i=0; i<apiUrlList.length; i++) {
        promiseList.push(requestsController.saveRssToDatabasePromise(apiUrlList[i]));
    }

    lastUpdated = Date.now();
    Promise.allSettled(promiseList); // Takes all of the promises and creates one big promise

});



router.get("/", async (req, res) => {

    //TODO Sort/filter has to be done around here
    Article.find().sort({pubDate: -1})
        .then(result => {
            res.render("articles.ejs", {title: "All Articles", article: result, pageTitle: "Articles", lastUpdated: lastUpdated});
        })
        .catch(err => {
            console.log(err);
        })
});

// This won't work anymore since we're getting json data from multiple sources, need to create a new way of doing it.
router.get("/json", async (req, res) => {
    // jsonData = await requestsController.requestFromUrl(apiURL);
    // res.json(jsonData);

});

router.get("/runtest", async (req, res) => {
    newsFeedSources = JSON.parse(fs.readFileSync("newsSourceList.json"));
    urlList = newsFeedSources.urls;

    urlArray = [];

    for (let url in urlList) {
        urlArray.push(urlList[url]);
    }
    
    console.log(urlArray[0]);

    res.send("lol");
})



module.exports = router;
