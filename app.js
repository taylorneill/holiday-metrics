// setup express
const express = require('express');

const app = express();
const AWS = require('aws-sdk');
const cors = require('cors');
const csv = require('csv');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// const isDev = process.env.NODE_END !== 'production';


// setup aws-sdk
const awsConfig = {
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();


// GET stats from dynamodb based on query param id

// Default id if no param given in url
const searchKey = '123123124';

app.get('/', (req, res) => {
  const { id } = req.query;
  const params = {
    TableName: 'ARTIST_DATA',
    Key: {
      ARTIST_ID: id || searchKey,
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
