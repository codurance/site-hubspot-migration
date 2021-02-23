const axios = require('axios');

exports.main = (context, sendResponse) => {
    const { hapiKey } = process.env;
    const { hubspotutk } = context.params;

    const url = `http://api.hubapi.com/contacts/v1/contact/utk/${hubspotutk}/profile`;
    axios.get(url, {params: { hapiKey }}).then(data => {
        console.log('hi')
        return sendResponse({body: data, statusCode: 200});
        // try {
        //     if (data && JSON.parse(data).vid) {
        //     }
        // } catch {
        //     sendResponse({body: JSON.stringify({contact: false}), statusCode: 200});
        // }
    }).catch(err => {
        console.log('hello')
        sendResponse({body: err, statusCode: 200});
    });
 };