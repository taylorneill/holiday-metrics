# holiday-metrics


next steps:

-- build importer to interate through CSV, convert to JSON and import into DynamoDB.  Need to hash artist ID field (this will be used in the search query).  Importer will need to output a list of URLs for each artist.


completed:

-- grab param from URL to use in search query 
    ie:  http://localhost:3000/?id=123123123

    then search in DynamoDB for key '123123123' 