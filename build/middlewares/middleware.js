"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizeUser = exports.tokenGenerator = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//secret key used in the encoding process. Can be anything
//using jwt to endcode user information and returning it back as a token so they use it to make requests
var tokenGenerator = function tokenGenerator(user, callback) {
  _jsonwebtoken["default"].sign({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    password: user.password,
    role: user.role
  }, process.env.SECRET, {
    expiresIn: "2h"
  }, function (err, res) {
    callback(err, res);
  });
}; //endpoint to decode token provided by the user and check if to authorize the request or not


exports.tokenGenerator = tokenGenerator;

var authorizeUser = function authorizeUser(req, res, next) {
  var token = req.headers.authorization || req.headers["x-access-token"] || req.body.token;

  if (token) {
    _jsonwebtoken["default"].verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        res.send(err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({
      status: "Failed",
      message: "Authentication required for this route"
    });
  }
};

exports.authorizeUser = authorizeUser;