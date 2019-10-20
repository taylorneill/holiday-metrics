const express = require('express');

const app = express();
const AWS = require('aws-sdk');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const { importer } = require('./utils/importer.js');

dotenv.config();

const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// const isDev = process.env.NODE_ENV !== 'production';
// setup aws-sdk
const awsConfig = {
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();

const csvFilename = '/Users/andrelowy/Documents/Projects/holiday-metrics/test_data/test_data.csv';

const rs = fs.createReadStream(csvFilename);


rs.pipe(importer(docClient));


// GET stats from dynamodb based on query param id

// Default id if no param given in url
const searchKey = '123123124';

const getStatsById = (id) => {
  const params = {
    TableName: 'ARTIST_DATA',
    Key: {
      ARTIST_ID: id || searchKey,
    },
  };

  const artistStats = new Promise((resolve, reject) => docClient.get(params, (err, data) => {
    if (data) {
      resolve(data);
    } else if (err) {
      reject(err);
    }
  }));

  return artistStats;
};


app.get('/', (req, res) => {
  const { id } = req.query;
  getStatsById(id)
    .then(({ Item }) => res.json(Item))
    .catch(({ Item }) => res.json(Item));
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
