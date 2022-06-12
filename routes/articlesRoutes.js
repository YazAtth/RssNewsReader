const { clearCache } = require("ejs");
const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const { exit } = require("process");  // Temporary for debugging

const requestsController = require("../controllers/requestsController");
const Article = require("../models/Article");

const apiURL = 'https://www.theguardian.com/international/rss';
const apiURL2 = 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml';

let apiUrlList = ['https://www.theguardian.com/international/rss', 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'];


// Makes requests and updates database every 15 minutes
// schedule.scheduleJob("*/15 * * * *", async () => {
schedule.scheduleJob("*/30 * * * * *", async () => {
    console.log("Started schedule");

    promiseList = [];

    for (let i=0; i<apiUrlList.length; i++) {
        promiseList.push(requestsController.saveRssToDatabasePromise(apiUrlList[i]));
    }

    Promise.allSettled(promiseList);

});



router.get("/", async (req, res) => {
    console.log("ran");
    Article.find()
        .then(result => {
            res.render("articles.ejs", {title: "All Articles", article: result, pageTitle: "Articles", lastUpdated: "NaN"});
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
    console.log(Date.now());

    res.send("lol");
})



module.exports = router;
