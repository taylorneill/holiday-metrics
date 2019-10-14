// setup express
const express = require('express');

const app = express();
const AWS = require('aws-sdk');
const cors = require('cors');
const csv = require('csv');

const port = 3000;

app.use(cors());


// searchKey test
const searchKey = '123123124';

// let searchKey = function () {

// };

// setup aws-sdk
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


// do stuff

app.get('/', (req, res) => {
  const { id } = req.query;
  const params = {
    TableName: 'ARTIST_DATA',
    Key: {
      ARTIST_ID: '' || id,
    },
  };

  // eslint-disable-next-line consistent-return
  docClient.get(params, (err, data) => {
    if (err) {
      res.json(err);
    } else if (data) {
      res.json(data);
    }
  });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
