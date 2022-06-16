const { clearCache } = require("ejs");
const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const fs = require("fs");
const { exit } = require("process");  // Temporary for debugging


const filtersController = require("../controllers/filtersController");
const requestsController = require("../controllers/requestsController");
const Article = require("../models/Article"); // Import schema for each Article for the db

// Takes the URLs from the JSON file and turns them into an array
clientPreferences = JSON.parse(fs.readFileSync("clientPreferences.json"));
jsonRssSourceList = clientPreferences.rssSources;
apiUrlList = [];
for (let i=0; i<jsonRssSourceList.length; i++) {
    apiUrlList.push(jsonRssSourceList[i].url);
}

lastUpdated = undefined;  // Displayed to the user to show when the news feed was last updated (eg. 14 minutes ago)


// Makes requests and updates database every 15 minutes
schedule.scheduleJob("*/15 * * * *", async () => {
// schedule.scheduleJob("*/30 * * * * *", async () => {
//  schedule.scheduleJob(requestsController.crontimeParser(), async () => {

    console.log("\nStarted schedule");

    promiseList = [];

    for (let i=0; i<apiUrlList.length; i++) {
        promiseList.push(requestsController.saveRssToDatabasePromise(apiUrlList[i]));
    }

    lastUpdated = Date.now();
    Promise.allSettled(promiseList); // Takes all of the promises and creates one big promise

});



router.get("/", async (req, res) => {

    //TODO Sort/filter has to be done around here
    Article.find(filtersController.applyUserFilters())
        .sort(filtersController.applyUserSort())
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
    clientPreferences = JSON.parse(fs.readFileSync("clientPreferences.json"));
    requiredKeyword = clientPreferences.filterPreferences.requiredKeywords.requireAtLeastOneItem[0];
    
    // Article.find({$or: [{"title": {"$regex": requiredKeyword, "$options":"i"}}, {"description": {"$regex": requiredKeyword, "$options":"i"}}]})
    Article.find(filtersController.regexCompiler())
        .sort(filtersController.applyUserSort())
        .then(result => {
            res.render("articles.ejs", {title: "Run Test", article: result, pageTitle: "Run Test", lastUpdated: lastUpdated});
        })
        .catch(err => {
            console.log(err);
        })

})



module.exports = router;
