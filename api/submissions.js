const handler = require("./index");

module.exports = function submissionsHandler(req, res) {
  req.endpoint = "/api/submissions";
  return handler(req, res);
};
