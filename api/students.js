const handler = require("./index");

module.exports = function studentsHandler(req, res) {
  req.endpoint = "/api/students";
  return handler(req, res);
};
