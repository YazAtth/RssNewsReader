const fs = require("fs");


const applyUserFilters = () => {
    // return {$or:[{sourceTitle: "The Guardian"}, {sourceTitle: "New York Times"}]}
    return {};
}

const applyUserSort = () => {
    return {pubDate: -1};
}

module.exports = {
    applyUserFilters,
    applyUserSort
};