const axios = require('axios');

exports.main = (context, sendResponse) => {
    const { hapiKey } = process.env;
    const { hubspotutk } = context.params;

    const getContact = async _ => {
        try {
            const url = `https://api.hubapi.com/contacts/v1/contact/utk/${hubspotutk}/profile?hapikey=${hapiKey}`
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    const isContact = async _ => {
        const contact = await getContact();
        return contact && !!contact.vid;
    }

    (async _ => {
        const res = { is_contact: await isContact() };
        sendResponse({body: res, statusCode: 200});
    })()
 };