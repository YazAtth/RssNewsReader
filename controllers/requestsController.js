const axios = require("axios");
const xml2js = require('xml2js');


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


    


module.exports = {
    requestFromUrl, 
    adder
}