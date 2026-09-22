const handler = require("./index");

module.exports = function roundsHandler(req, res) {
  req.endpoint = "/api/rounds";
  return handler(req, res);
};
