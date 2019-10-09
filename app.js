//setup express
const express = require('express')
const app = express()
const port = 3000

// setup aws-sdk
var AWS = require('aws-sdk');
//const config = require('config/config.js');
//const isDev = process.env.NODE_END !== 'production';

//read config.js 


let awsConfig = {
    "region" : "us-east-1",
    "endpoint" :"https://dynamodb.us-east-1.amazonaws.com",
//    "accessKeyID" : "AKIATEB32ECC6Q3WW24Z", 
//    "secretAccessKey" : "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",
};


AWS.config.update(awsConfig);

//do stuff
let docClient = new AWS.DynamoDB.DocumentClient();

let retrieveArtistStats = function () {
    var params = {
        TableName: "ARTIST_DATA",
        Key: {
            "ARTIST_ID": "123123128"
        }
    };

        docClient.get(params, function(err, data) { 
            if (err) {
                console.log("ARTIST_DATA::retrieveArtistStats::error - " + JSON.stringify(err, null, 2));
            }
            else {
               // console.log("ARTIST_DATA::retrieveArtistStats::success - " + JSON.stringify(data, null, 2));
              searchOutput = JSON.stringify(data,null,2);
             // console.log(data);
            }
        }
        );
}

var searchOutput = retrieveArtistStats();

let searchArtistID 

//do stuff

//app.get('/', (req, res) => res.send(searchOutput))

app.get('/', function(req, res){
    res.send('id: '+ req.query.id + ' \n\n\n' + searchOutput);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
