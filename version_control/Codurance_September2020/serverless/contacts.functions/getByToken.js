const axios = require('axios');

exports.main = (context, sendResponse) => {
    const { hubspotutk } = context.params;

    const getContact = async _ => {
        try {
            const url = `https://api.hubapi.com/contacts/v1/contact/utk/${hubspotutk}/profile`
            const response = await axios.get(url,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.codurance_web}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return error;
        }
    }

    const isContact = async _ => {
        const contact = await getContact();
        return contact && !!contact['is-contact'];
    }

    (async _ => {
        const res = { is_contact: await isContact() };
        sendResponse({body: res, statusCode: 200});
    })()
 };