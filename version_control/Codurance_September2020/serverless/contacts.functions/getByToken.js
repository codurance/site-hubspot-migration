const axios = require('axios');

exports.main = (context, sendResponse) => {
    const { hapiKey } = process.env;
    const { hubspotutk } = context.params;

    // const getContact = async _ => {
    //     try {
            const url = `https://api.hubapi.com/contacts/v1/contact/utk/${hubspotutk}/profile?hapikey=${hapiKey}`
    //         const response = await axios.get(url);
    //         return response.data;
    //     } catch (error) {
    //         return error;
    //     }
    // }

    // const isContact = async _ => {
    //     const contact = await getContact();
    //     return contact && !!contact.vid;
    // }

    // const res = { is_contact: isContact() };
    // sendResponse({body: res, statusCode: 200});

    axios.get(url)
        .then(function (response) {
            const contact = response.data
            const isContact = contact && !!contact.vid
            sendResponse({body: {is_contact: isContact}, statusCode: 200});
        })
        .catch(function (error) {
            sendResponse({body: {is_contact: false}, statusCode: 422});
        })
 };