"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _usersController = require("../controllers/users-controller.js");

var _check = require("express-validator/check");

var _middleware = require("../middlewares/middleware.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_bodyParser["default"].json()); //endpoint  to create User acct

app.post('/users', [(0, _check.check)('first_name').isAlpha().withMessage('First name must be alphabets only').isLength({
  min: 3,
  max: 20
}).withMessage('First name be of 3 characters and above'), (0, _check.check)('email', 'email must be valid').isEmail(), (0, _check.check)('phone_no', 'Mobile number must be valid').isMobilePhone(), (0, _check.check)('password').isLength({
  min: 5
}).withMessage('Password must have a minimum length of 5'), (0, _check.check)('email').isEmail().withMessage('email exists, please enter a new one')], _usersController.createUser); //endpoint for logging in

app.post('/users/login', _usersController.userLogin); //endpoint for getting user profile details

app.get('/me', _middleware.authorizeUser, _usersController.getUser);
var _default = app;
exports["default"] = _default;