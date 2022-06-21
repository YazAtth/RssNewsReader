const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    sourceTitle: String,
    title: {
        type: String,
        required: true
    },
    link: String,
    description: String,
    pubDate: {
        type: Date,
        required: true
    },
    "dc:creator": String,
    itemID: String,
    dbUploadDate: {type: Date, default: Date.now},
    keywords: [String]
});




// The first argument is the Collection Name
const Item = mongoose.model("dbpracticecollections", ArticleSchema);
module.exports = Item