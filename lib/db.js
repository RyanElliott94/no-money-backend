require("dotenv").config();
const jwt = require('jsonwebtoken');

  const createAccessToken = (payload) => {
    const newAccessToken = jwt.sign({
      fileLocation: payload.fileLocation
    },
    process.env.ACCESS_TOKEN_PRIVATE,
    {
        expiresIn: "24hr"
    });
    return newAccessToken
  }

  const fetchFileFromToken = (req, res, next) => {
      console.log(req.params.token)
      jwt.verify(req.params.token, process.env.ACCESS_TOKEN_PRIVATE, (err, data) => {
          console.log(data)
          if(data) {
              req.fileFound = true;
              req.fileLocation = data.fileLocation;
              next();
          }else{
              req.error = true;
              req.errorMessage = err.stack;
              next();
          }
      });
  }

  module.exports = {
    createAccessToken,
    fetchFileFromToken
  }
  // module.exports = createAccessToken;