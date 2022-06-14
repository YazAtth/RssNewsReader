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


module.exports = {
    applyUserFilters,
    applyUserSort
};