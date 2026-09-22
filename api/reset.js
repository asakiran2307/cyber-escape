const handler = require("./index");

module.exports = function resetHandler(req, res) {
  req.endpoint = "/api/reset";
  return handler(req, res);
};
