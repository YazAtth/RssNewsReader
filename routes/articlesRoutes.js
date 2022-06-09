const { clearCache } = require("ejs");
const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const { exit } = require("process");  // Temporary for debugging

const requestsController = require("../controllers/requestsController");
const Article = require("../models/Article");
const apiURL = 'https://www.theguardian.com/international/rss';


// Makes requests and updates database every 15 minutes
schedule.scheduleJob("*/15 * * * *", async () => {
    console.log("ran");

    dbData = await requestsController.requestFromUrl(apiURL)

    for (let i=0; i<dbData.length; i++) {
        const post = new Article({
            title: dbData[i].title[0],
            description: dbData[i].description[0],
            link: dbData[i].link[0],
            pubDate: dbData[i].pubDate[0],
            "dc:creator": dbData[i]["dc:creator"][0],
            "itemID": "[" + dbData[i].pubDate + "][" + dbData[i].title + "]"
        });
    

        // Below, stops entries from being entered more than once into the db

        // Post.find runs asynchrounously so the variable "i" will be evaluated at the end when it is 2 instead of iterating.
        // Making the "newPost" variable ensures this doesn't happen.
        newPostTitle = dbData[i].title[0];
        newPostDate = dbData[i].pubDate[0];

    

        let titleArr = [];
        let dateArr = [];
        let updatedArticlePtr;


        const dbMongo = await Article.find({}, (err, articlesInCollection) => {
            // console.log(`Title: ${newPostTitle}`);
            // console.log("start two");
            if(err) console.log(err);
        }).clone()
            .then(result => {
            
                // Iterates through every item in the db collection and adds the itemID of every item into an array
                result.map(singleArticle => {
                    // itemIdArr.push(singlePost.itemID); 
                    titleArr.push(singleArticle.title);  
                    dateArr.push(singleArticle.pubDate);                
                })

                let isDuplicates = false;
                let hasUpdate = false;

                // Compares the itemID of the new item with the itemID of all the existing items in the db
                // If a duplicate is found, "isDuplicates" is set to "true" 

                for (j=0; j<titleArr.length; j++) {  
                    // console.log(`looking at ${titleArr[j]} AND ${newPostTitle}`);
                    
                    if (titleArr[j] == newPostTitle && dateArr[j] == newPostDate) {
                        isDuplicates = true;
                        // console.log(`${titleArr[j]} == ${newPostTitle}`);
                        console.log("found duplicate");
                        break;
                    } else if (titleArr[j] == newPostTitle) {
                        hasUpdate = true;
                        console.log(`post has an update: ${newPostTitle}`);
                        updatedArticlePtr = titleArr[j];
                        break;
                    }
                }



                // Ensures a post will be saved only if it is not a duplicate
                if (isDuplicates === false && hasUpdate === false) {
                    post.save(); // uploads the post to the database
                    // console.log("POST WAS SAVED");
                }
                else if (hasUpdate === true ){
                    Article.deleteMany({title: updatedArticlePtr}) // Deletes old versions of article
                        .then(result => {
                            post.save(); // Saves new versions of article
                            console.log("Updated Post");
                        });
                }           
            });
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
