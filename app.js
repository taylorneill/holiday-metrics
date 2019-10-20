const express = require('express');

const app = express();
const AWS = require('aws-sdk');
const cors = require('cors');
const parse = require('csv-parse');
const dotenv = require('dotenv');
const fs = require('fs');
const async = require('async');
const crypto = require('crypto');

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

const parser = parse({
  columns: true,
  delimiter: ',',
}, (parseError, data) => {
  if (parseError) {
    console.log('**********', parseError, '**********');
    return;
  }
  if (data) {
    const cleanData = {};
    Object.keys(data[0]).forEach((key) => {
      if (key.includes(' ')) {
        const newKey = key.replace(/\s/gi, '_');
        cleanData[newKey] = data[0][key];
      } else {
        cleanData[key] = data[0][key];
      }
    });
    console.log(JSON.stringify(cleanData));
    return;
  }

  const chunkArray = [];
  const size = 20;

  while (data.length > 0) {
    chunkArray.push(data.splice(0, size));
  }
  let dataImported = false;
  let chunkNum = 1;

  async.each(chunkArray, (itemData, callback) => {
    const params = {
      RequestItems: {},
    };

    params.RequestItems.ARTIST_DATA = [];
    itemData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        // An AttributeValue may not contain an empty string
        if (item[key] === '') { delete item[key]; }
      });

      params.RequestItems.ARTIST_DATA.push({
        PutRequest: {
          Item: {
            ...item,
          },
        },
      });
    });


    docClient.batchWrite(params, (err, res, cap) => {
      console.log('done going next');
      if (err == null) {
        console.log(`Success chunk #${chunkNum}`);
        dataImported = true;
      } else {
        console.log(err);
        console.log(`Fail chunk #${chunkNum}`);
        dataImported = false;
      }
      chunkNum += 1;
      callback();
    }, () => {
    // run after loops
      console.log('all data imported....');
    });
  });
});

rs.pipe(parser);


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
