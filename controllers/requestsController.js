const axios = require("axios");
const xml2js = require('xml2js');


const requestFromUrl = url => {
    return new Promise(function(resolve, reject) {
        axios.get(url).then(res => {
            res = res.data;

            xml2js.parseString(res, (err, result) => {

                // const jsonRss = JSON.stringify(result, null, 4); // Third argument is the spacing, 4 is a good amount of spacing            
                // "result" has unecessary JSON data relating to version numbers and the title page of the website which is removed below so we only have the news articles
                outputJson = result.rss.channel[0].item

                // console.log(outputJson[0].title); // Gets first title of the first article in the array of articles

                resolve(outputJson);
            })
        })
    })
}

const adder = (x1, x2) => console.log(x1 + x2);


module.exports = {
    requestFromUrl, 
    adder
}