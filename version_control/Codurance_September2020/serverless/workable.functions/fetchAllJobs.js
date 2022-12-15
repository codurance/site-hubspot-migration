// Require axios library to make API requests
const axios = require("axios");

exports.main = (context, sendResponse) => {
  const fetchJobs = async () => {
    try {
      const url =
        "https://www.workable.com/api/accounts/codurance?details=false";
      const response = await axios.get(url);
      return sendResponse({
        body: { response: response.data },
        statusCode: 200
      });
    } catch (error) {
      return sendResponse({ body: { error: error.message }, statusCode: 500 });
    }
  };

  fetchJobs();
};
