# holiday-metrics


next steps:

1) grab param from URL to use in search query 
    ie:  http://localhost:3000/?id=123123123

    then search in DynamoDB for '123123123' 

2) build importer to interate through CSV, convert to JSON and import into DynamoDB.  Needs to hash artist ID field (this will be used in the search query).

