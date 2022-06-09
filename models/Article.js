const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: String,
    description: String,
    pubDate: {
        type: String,
        required: true
    },
    "dc:creator": String,
    itemID: String
});

// The first argument is the Collection Name
const Item = mongoose.model("dbpracticecollections", ArticleSchema);
module.exports = Item