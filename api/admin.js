const handler = require("./index");

module.exports = function adminHandler(req, res) {
  req.endpoint = "/api/admin";
  return handler(req, res);
};
