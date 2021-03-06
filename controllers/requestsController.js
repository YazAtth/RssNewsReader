const axios = require("axios");
const xml2js = require('xml2js');
const fs = require("fs");


const Article = require("../models/Article");



const requestFromUrl = url => {
    return new Promise(function(resolve, reject) {
        axios.get(url).then(res => {
            res = res.data;

            xml2js.parseString(res, (err, result) => {

                // const jsonRss = JSON.stringify(result, null, 4); // Third argument is the spacing, 4 is a good amount of spacing            

                resolve(result.rss.channel);
            })
        });
    })
}

const adder = (x1, x2) => console.log(x1 + x2);


const saveRssToDatabase = async (url) => {

    dbData = await requestFromUrl(url) // Returns data from the News Sources formatted as a JSON object

    // let sourceTitle = dbData[0].title[0];  // Gets the title of the news source
    // let sourceTitle = returnNewsSourceTitle(dbData[0].title[0]);  // Gets the title of the news source
    //! sourceTitle for articles are sometimes messed up in the console messages but not the database for some reason
    //! Looking at console messages: sourceTitle for an article is equal to the sourceTitle of the article preceeding it
    let sourceTitle = await returnNewsSourceTitleFromUrl(url);
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
        

        const sameArticleTitleExists = await Article.exists({title: newPostTitle}, {sourceTitle: sourceTitle}); // Checks to see if an article exists in the db with the same title within the same source
        const sameArticleDateExists = await Article.exists({pubDate: newPostDate}, {sourceTitle: sourceTitle}); // Checks to see if an article exists in the db with the same pubDate within the same source

        if (sameArticleTitleExists && sameArticleDateExists) { // If an article already exists in the db with the same title and date: marked as duplicated
            // console.log("Duplicate Found");
        }
        else if (sameArticleTitleExists && !sameArticleDateExists) { // An an article exists in the db with the same title but different date: marked as an update for the article
            console.log(`Article with Update Found: [${sourceTitle}] ${newPostTitle}`);
            Article.deleteMany({title: {$in: [newPostTitle]}}) // Deletes old versions of article
                        .then(result => {
                            post.save(); // Saves new versions of article
                        });
        }
        else { // Otherwise marked as a new article
            console.log(`New Article Found: [${sourceTitle}] ${newPostTitle}`);
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


const returnNewsSourceTitleFromUrl = inputUrl => {
    return new Promise(function(resolve, reject) {
        clientPreferences = JSON.parse(fs.readFileSync("clientPreferences.json"));
        jsonRssSourceList = clientPreferences.rssSources; // Returns an array of all the Rss sources

        let sourceTitle = "Unknown Source"

        jsonRssSourceList.filter(rssSource => {
            if (rssSource.url === inputUrl ) {
                sourceTitle = rssSource.title;
            }
        });

        // return sourceTitle;
        resolve(sourceTitle);
    })

}

const crontimeParser = () => {  // Gets the refresh rate from the json file an outputs it in a way the crontab scheduler understands (eg. 15mins = */15 * * * *)
    clientPreferences = JSON.parse(fs.readFileSync("clientPreferences.json"));
    timeDurationInMinutes = clientPreferences.refreshRateInMinutes;

    output = "";

    if (timeDurationInMinutes < 1) {
        let timeDurationInSeconds = Math.round(timeDurationInMinutes * 60);
        output = `*/${timeDurationInSeconds} * * * * *`;
    }
    else {
        output = `*/${timeDurationInMinutes} * * * *`;
    }

    console.log(output);

    return output;
}


    


module.exports = {
    requestFromUrl, 
    adder,
    saveRssToDatabase,
    saveRssToDatabasePromise,
    crontimeParser,
}