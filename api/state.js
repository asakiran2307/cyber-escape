const handler = require("./index");

module.exports = function stateHandler(req, res) {
  req.endpoint = "/api/state";
  return handler(req, res);
};
