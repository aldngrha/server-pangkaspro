const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  serviceName: process.env.SERVICE_NAME,
  urlDb: process.env.URL_MONGODB,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: "2h",
  // jwtRefreshTokenSecret: process.env.JWT_SECRET_REFRESH_TOKEN,
  // jwtRefreshTokenExpiration: '24h',
  // gmail: process.env.GMAIL,
  // password: process.env.PASSWORD,
};
