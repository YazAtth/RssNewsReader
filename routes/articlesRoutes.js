const { clearCache } = require("ejs");
const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const { exit } = require("process");  // Temporary for debugging

const requestsController = require("../controllers/requestsController");
const Article = require("../models/Article");
const apiURL = 'https://www.theguardian.com/international/rss';


// Makes requests and updates database every 15 minutes
schedule.scheduleJob("*/60 * * * * *", async () => {

    dbData = await requestsController.requestFromUrl(apiURL) // Returns data from the News Sources formatted as a JSON object

    for (let i=0; i<dbData.length; i++) {
        const post = new Article({
            title: dbData[i].title[0],
            description: dbData[i].description[0],
            link: dbData[i].link[0],
            pubDate: dbData[i].pubDate[0],
        });
    
        newPostTitle = dbData[i].title[0];
        newPostDate = dbData[i].pubDate[0];

        const sameArticleTitleExists = await Article.exists({title: newPostTitle});
        const sameArticleDateExists = await Article.exists({pubDate: newPostDate});

        if (sameArticleTitleExists && sameArticleDateExists) { // If an article already exists in the db with the same title and date: marked as duplicated
            // console.log("Duplicate Found");
        }
        else if (sameArticleTitleExists && !sameArticleDateExists) { // An an article exists in the db with the same title but different date: marked as an update for the article
            console.log("Article with Update Found");
            Article.deleteMany({title: newPostTitle}) // Deletes old versions of article
                        .then(result => {
                            post.save(); // Saves new versions of article
                        });
        }
        else { // Otherwise marked as a new article
            console.log("New Article Found");
            post.save();
        }
    }
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
    let sampleTitle = "No regrets over handling of Vladimir Putin, says Angela Merkel";

    const articleExists = await Article.exists({title: sampleTitle})

    if (articleExists) {
        console.log("Exists");
    } else {
        console.log("Does Not Exist");
    }

    res.send("lol");
})



module.exports = router;
