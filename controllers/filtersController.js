const { clearCache } = require("ejs");
const util = require('util')
const fs = require("fs");


const applyUserFilters = () => {
    clientPreferences = JSON.parse(fs.readFileSync("clientPreferences.json"));
    filterPreferences = clientPreferences.filterPreferences;
    visibleNewsSourcesList = filterPreferences.showInFeed;

    if (visibleNewsSourcesList.length == 0) { // If the visible news sources in the JSON file aren't populated: returns all of the sources
        return {}
    }


    filterArgument = [];
    for (let i=0; i<visibleNewsSourcesList.length; i++) { // Constructs a list of objects eg. {sourceTitle: "The Guardian"} and puts them in a list
        filterArgument.push({sourceTitle: visibleNewsSourcesList[i]});
    }
    filterArgumentFull = {$or: filterArgument}; // "$or" argument tells mongoose .find() function that at least one of the items in the list must be satified for it to show the article

    return filterArgumentFull; // Returns the argument for the mongoose .find() function
}


const applyUserSort = () => { // Reads relevant mongoose sort() arguments from JSON file and places them into the return statement which goes inside the sort() function
    clientPreferences = JSON.parse(fs.readFileSync("clientPreferences.json"));
    sortPreferences = clientPreferences.sortPreferences;

    sortField = sortPreferences.sortByField;
    order = sortPreferences.order;

    return {[sortField]: order};
}

const regexCompiler = () => {
    clientPreferences = JSON.parse(fs.readFileSync("clientPreferences.json"));

    requireAtLeastOneItem = clientPreferences.filterPreferences.requiredKeywords.requireAtLeastOneItem;
    requireAllItems = clientPreferences.filterPreferences.requiredKeywords.requireAllItems;
    requireAllItemsBeExcluded = clientPreferences.filterPreferences.requiredKeywords.excludedItems;

    filterArgumentOr = [];
    filterArgumentAnd = [];
    filterArgumentNegation = [];

    for (i=0; i<requireAtLeastOneItem.length; i++) { // We use $or here as the item can be in the title OR description
        filterArgumentOr.push({$or: [{"title": {"$regex": requireAtLeastOneItem[i], "$options":"i"}}, {"description": {"$regex": requireAtLeastOneItem[i], "$options":"i"}}]})
    }

    for (i=0; i<requireAllItems.length; i++) {
        filterArgumentAnd.push({$or: [{"title": {"$regex": requireAllItems[i], "$options":"i"}}, {"description": {"$regex": requireAllItems[i], "$options":"i"}}] })
    }

    for (i=0; i<requireAllItemsBeExcluded.length; i++) {
        // filterArgumentNegation.push({$or: [{"title": {"$regex": requireAllItems[i], "$options":"i"}}, {"description": {"$regex": requireAllItems[i], "$options":"i"}}]})
        filterArgumentNegation.push({$and: [{"title": {"$not": {"$regex": requireAllItemsBeExcluded[i], "$options":"i"}}}, {"description": {"$not": {"$regex": requireAllItemsBeExcluded[i], "$options":"i"}}}]});

    }

    // console.log({$and: filterArgumentAnd});
    // console.log({$and: filterArgumentNegation});


    outsideFilterArgument = [];

    if (requireAtLeastOneItem.length != 0) {
        outsideFilterArgument.push({$or: filterArgumentOr})
    }
    if (requireAllItems.length != 0) {
        outsideFilterArgument.push({$and: filterArgumentAnd})
    }
    if (requireAllItemsBeExcluded.length != 0) {
        outsideFilterArgument.push({$and: filterArgumentNegation});
    }


    if (outsideFilterArgument.length == 0) { // If no filters are applied: will return empty object
        return {};
    }

    filterArgument = {$and: outsideFilterArgument}
    // filterArgument = {"title": {"$not": {"$regex": "macron", "$options":"i"}}} //! That worked in removing word from the title
    // filterArgument = {$and: [{"title": {"$not": {"$regex": "macron", "$options":"i"}}}, {"description": {"$not": {"$regex": "macron", "$options":"i"}}}]}
    // filterArgument = {$and: 
    //     [
    //         {$and: [{"title": {"$not": {"$regex": "macron", "$options":"i"}}}, {"description": {"$not": {"$regex": "macron", "$options":"i"}}}]},
    //         {$and: [{"title": {"$not": {"$regex": "elon", "$options":"i"}}}, {"description": {"$not": {"$regex": "elon", "$options":"i"}}}]}
    //     ]
    // }


        


    // console.log(util.inspect(filterArgument, {showHidden: false, depth: null, colors: true}))
    return filterArgument;
    
}




module.exports = {
    applyUserFilters,
    applyUserSort,
    regexCompiler
};