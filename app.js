// setup express
const express = require('express');

const app = express();
const port = 3000;
const cors = require('cors');
const csv = require('csv');

// searchKey test
const searchKey = '123123124';

// let searchKey = function () {

// };

// setup aws-sdk
const AWS = require('aws-sdk');
// const config = require('config/config.js');
// const isDev = process.env.NODE_END !== 'production';

// read config.js


const awsConfig = {
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
};


AWS.config.update(awsConfig);

// do stuff
const docClient = new AWS.DynamoDB.DocumentClient();

const retrieveArtistStats = () => {
  const params = {
    TableName: 'ARTIST_DATA',
    Key: {
      ARTIST_ID: searchKey,
    },
  };

  docClient.get(params, (err, data) => {
    if (err) {
    //   console.log(`ARTIST_DATA::retrieveArtistStats::error - ${JSON.stringify(err, null, 2)}`);
      return `ARTIST_DATA::retrieveArtistStats::error - ${JSON.stringify(err, null, 2)}`;
    }
    // console.log("ARTIST_DATA::retrieveArtistStats::success - " + JSON.stringify(data, null, 2));
    return JSON.stringify(data, null, 2);
    // console.log(data);
  });
};

const searchOutput = retrieveArtistStats();


// do stuff

// app.get('/', (req, res) => res.send(searchOutput))

app.get('/', (req, res) => {
  res.send(`id: ${req.query.id} \n\n\n${searchOutput}`);
});

app.listen(port, () => console.log(`Example app listening on port ${port} and ${process.env.ACCESS_KEY_ID}!`));
