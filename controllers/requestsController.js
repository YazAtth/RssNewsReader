const axios = require("axios");
const xml2js = require('xml2js');

const Article = require("../models/Article");



const requestFromUrl = url => {
    return new Promise(function(resolve, reject) {
        axios.get(url).then(res => {
            res = res.data;

            xml2js.parseString(res, (err, result) => {

                // const jsonRss = JSON.stringify(result, null, 4); // Third argument is the spacing, 4 is a good amount of spacing            

                resolve(result.rss.channel);
            })
        })
    })
}

const adder = (x1, x2) => console.log(x1 + x2);


const saveRssToDatabase = async (url) => {

    dbData = await requestFromUrl(url) // Returns data from the News Sources formatted as a JSON object

    let sourceTitle = dbData[0].title[0];  // Gets the title of the news source
    let dbDataBody = dbData[0].item;  // Removes all but the array of news articles

    for (let i=0; i<dbDataBody.length; i++) {
        const post = new Article({
            sourceTitle: sourceTitle,
            title: dbDataBody[i].title[0],
            description: dbDataBody[i].description[0],
            link: dbDataBody[i].link[0],
            pubDate: dbDataBody[i].pubDate[0],
        });
    
        newPostTitle = dbDataBody[i].title[0];
        newPostDate = dbDataBody[i].pubDate[0];
        

        const sameArticleTitleExists = await Article.exists({title: newPostTitle}); // Checks to see if an article exists in the db with the same title
        const sameArticleDateExists = await Article.exists({pubDate: newPostDate}); // Checks to see if an article exists in the db with the same pubDate

        if (sameArticleTitleExists && sameArticleDateExists) { // If an article already exists in the db with the same title and date: marked as duplicated
            // console.log("Duplicate Found");
        }
        else if (sameArticleTitleExists && !sameArticleDateExists) { // An an article exists in the db with the same title but different date: marked as an update for the article
            console.log(`Article with Update Found: ${newPostTitle}`);
            Article.deleteMany({title: newPostTitle}) // Deletes old versions of article
                        .then(result => {
                            post.save(); // Saves new versions of article
                        });
        }
        else { // Otherwise marked as a new article
            console.log(`New Article Found: ${newPostTitle}`);
            post.save();
        }
    }
}

const saveRssToDatabasePromise = async (url) => {
    return new Promise(async function(resolve, reject) {
        try {
            saveRssToDatabase(url);
            resolve("Able")
        } catch {
            reject("Unable")
        }
    })
}
    


module.exports = {
    requestFromUrl, 
    adder,
    saveRssToDatabase,
    saveRssToDatabasePromise
}