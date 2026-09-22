const handler = require("./index");

module.exports = function attendanceHandler(req, res) {
  req.endpoint = "/api/attendance";
  return handler(req, res);
};
