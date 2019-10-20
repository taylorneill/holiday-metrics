const parse = require('csv-parse');
const async = require('async');
const crypto = require('crypto');


const importer = (docClient) => {
  const parser = parse({
    columns: true,
    delimiter: ',',
  }, (parseError, data) => {
    if (parseError) {
      console.log('**********', parseError, '**********');
      return;
    }

    let cleanData = {};
    if (data) {
      cleanData = data.map((datum) => {
        const cleanDatum = {};
        Object.keys(datum).forEach((key) => {
          if (key.includes(' ')) {
            const newKey = key.replace(/\s/gi, '_');
            cleanDatum[newKey] = datum[key];
          } else {
            cleanDatum[key] = datum[key];
          }
        });

        const hash = crypto.createHash('sha1').update(cleanDatum.GCDM_Artist_ID).digest('hex');

        return { ARTIST_ID: hash, data: JSON.stringify(cleanDatum) };
      });
    }

    const chunkArray = [];
    const size = 20;

    while (cleanData.length > 0) {
      chunkArray.push(cleanData.splice(0, size));
    }

    let chunkNum = 1;

    async.each(chunkArray, (itemData, callback) => {
      const params = {
        RequestItems: {},
      };

      params.RequestItems.ARTIST_DATA = [];
      itemData.forEach((item) => {
        // If uploading objects to ddb, an AttributeValue may not contain an empty string
        //   Object.keys(item.data).forEach((key) => {
        //     if (item.data[key] === '') {
        //       item.data[key] = 'n/a';
        //       console.log(item.data[key]);
        //     }
        //   });

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
          chunkNum += 1;
          callback();
        } else {
          console.log(err);
          console.log(`Fail chunk #${chunkNum}`);
          console.log('Stopping....');
        }
      });
    }, () => {
    // run after loops
      console.log('All data imported!');
    });
  });

  return parser;
};

module.exports = { importer };
