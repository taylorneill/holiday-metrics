//setup express
const express = require('express')
const app = express()
const port = 3000

//searchKey test
var searchKey = "123123124";

//let searchKey = function () {

//};

// setup aws-sdk
var AWS = require('aws-sdk');
//const config = require('config/config.js');
//const isDev = process.env.NODE_END !== 'production';

//read config.js 


let awsConfig = {
    "region" : "us-east-1",
    "endpoint" :"https://dynamodb.us-east-1.amazonaws.com"
};


AWS.config.update(awsConfig);

//do stuff
let docClient = new AWS.DynamoDB.DocumentClient();

let retrieveArtistStats = function () {
    var params = {
        TableName: "ARTIST_DATA",
        Key: {
            "ARTIST_ID": searchKey
        }
    };

        docClient.get(params, function(err, data) { 
            if (err) {
                console.log("ARTIST_DATA::retrieveArtistStats::error - " + JSON.stringify(err, null, 2));
            }
            else {
               // console.log("ARTIST_DATA::retrieveArtistStats::success - " + JSON.stringify(data, null, 2));
              return JSON.stringify(data,null,2);
             // console.log(data);
            }
        }
        );
}

let searchOutput = retrieveArtistStats();


//do stuff

//app.get('/', (req, res) => res.send(searchOutput))

app.get('/', function(req, res){
    res.send('id: '+ req.query.id + ' \n\n\n' + searchOutput);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
