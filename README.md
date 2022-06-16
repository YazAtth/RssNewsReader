# RssNewsReader

The program and its feed can be adjusted through the clientPreferences.json file.

### clientPrefrences.json Parameters

|Parameter Name| Description | Permitted Values |
|:--------------|:-------------|:------------------|
|refreshRateInMinutes| How often the feed refreshes and tries to pull new articles and updates to articles onto the database | *Any number* |
|rssSources.url| The URL of the RSS source | *Any valid RSS URL* |
|rssSources.title| The title given to the RSS source. A news service may have many different RSS feeds with differing titles (eg. BBC News, BBC Sport, BBC London), this allows us to identify and group  RSS feeds which allows for easier filtering and sorting| *String* |
|filterPreferences.showInFeed| News source titles entered into this list will be displayed on the user feed. | *Anything from rssSources.title*|
|sortPreferences.sortByField| The field which the sorting will be based on | `pubDate`, `dbUploadDate`, `SourceTitle`|
|sortPreferences.order| The order in which the field is sorted. Note: to sort from newest to oldest, order should be `descending` | `ascending`, `descending`|
