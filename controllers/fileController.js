const fs = require('fs');
const fileNameTwoDots = '../clientPreferences.json';
const fileNameOneDot = "./clientPreferences.json";
const file = require(fileNameTwoDots);


// fs.writeFile(fileNameOneDot, JSON.stringify(file, null, 2), (err) => { // For some reason the first parameter takes one dot before the filename but the "require()" at the top needs 2 dots
//     if (err) return console.log(err);
//     // console.log("saved");
// })

// Checks to see if client have Admin preferences
const requireAdmin = (req, res, next) => {
    fs.readFile("./clientPreferences.json", "utf-8", (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data)

        // console.log(obj.refreshRateInMinutes);

        if(obj.clientDetails.adminAccess == false) {
            res.send(" 403 Error - permission denied");
            // next(new Error("Permission denied."));
        }
        else {
            next();
        }
    });
}

const returnClientPreferences = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("./clientPreferences.json", "utf-8", (err, data) => {
            if (err) throw err;
            obj = JSON.parse(data)
            resolve(obj);
        });
    });
}




module.exports = {
    requireAdmin,
    returnClientPreferences
}

