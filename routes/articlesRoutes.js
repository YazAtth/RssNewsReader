const { clearCache } = require("ejs");
const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const { exit } = require("process");  // Temporary for debugging

const requestsController = require("../controllers/requestsController");
const Article = require("../models/Article");

const apiURL = 'https://www.theguardian.com/international/rss';
const apiURL2 = 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml';


// Makes requests and updates database every 15 minutes
// schedule.scheduleJob("*/15 * * * *", async () => {
schedule.scheduleJob("*/20 * * * * *", async () => {


    // dbData = await requestsController.requestFromUrl(apiURL) // Returns data from the News Sources formatted as a JSON object

    // let sourceTitle = dbData[0].title[0];  // Gets the title of the news source
    // let dbDataBody = dbData[0].item;  // Removes all but the array of news articles

    // for (let i=0; i<dbDataBody.length; i++) {
    //     const post = new Article({
    //         sourceTitle: sourceTitle,
    //         title: dbDataBody[i].title[0],
    //         description: dbDataBody[i].description[0],
    //         link: dbDataBody[i].link[0],
    //         pubDate: dbDataBody[i].pubDate[0],
    //     });
    
    //     newPostTitle = dbDataBody[i].title[0];
    //     newPostDate = dbDataBody[i].pubDate[0];
        

    //     const sameArticleTitleExists = await Article.exists({title: newPostTitle}); // Checks to see if an article exists in the db with the same title
    //     const sameArticleDateExists = await Article.exists({pubDate: newPostDate}); // Checks to see if an article exists in the db with the same pubDate

    //     if (sameArticleTitleExists && sameArticleDateExists) { // If an article already exists in the db with the same title and date: marked as duplicated
    //         // console.log("Duplicate Found");
    //     }
    //     else if (sameArticleTitleExists && !sameArticleDateExists) { // An an article exists in the db with the same title but different date: marked as an update for the article
    //         console.log(`Article with Update Found: ${newPostTitle}`);
    //         Article.deleteMany({title: newPostTitle}) // Deletes old versions of article
    //                     .then(result => {
    //                         post.save(); // Saves new versions of article
    //                     });
    //     }
    //     else { // Otherwise marked as a new article
    //         console.log(`New Article Found: ${newPostTitle}`);
    //         post.save();
    //     }
    // }
    // requestsController.saveRssToDatabase(apiURL);
    apiReq = await requestsController.saveRssToDatabasePromise(apiURL);

    console.log("Finished schedule");
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

router.get("/json", async (req, res) => {
    jsonData = await requestsController.requestFromUrl(apiURL);
    res.json(jsonData);
});

router.get("/runtest", async (req, res) => {
    console.log(Date.now());

    res.send("lol");
})



module.exports = router;
