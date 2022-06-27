const fs = require('fs');
const fileNameTwoDots = '../clientPreferences.json';
const fileNameOneDot = "./clientPreferences.json";
const file = require(fileNameTwoDots);

file.sampleFieldToBeModified = 38;

fs.writeFile(fileNameOneDot, JSON.stringify(file, null, 2), (err) => { // For some reason the first parameter takes one dot before the filename but the "require()" at the top needs 2 dots
    if (err) return console.log(err);
    // console.log("saved");
})




