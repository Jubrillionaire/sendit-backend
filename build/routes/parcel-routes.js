"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _parcelsController = require("../controllers/parcels-controller.js");

var _check = require("express-validator/check");

var _middleware = require("../middlewares/middleware.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_bodyParser["default"].json()); //create a new parcel order.

app.post('/parcels', [(0, _check.check)('recipient_phone_no', 'Please enter a valid mobile Number').isMobilePhone()], _middleware.authorizeUser, _parcelsController.createParcel); //get all parcel orders by a specific user

app.get('/users/:userId/parcels', _middleware.authorizeUser, _parcelsController.getAllParcels);
app.get('/parcels', _middleware.authorizeUser, _parcelsController.getParcels); //change destination of an order

app.patch('/parcels/destination', _middleware.authorizeUser, _parcelsController.changeDestination); //change status of an order

app.patch('/parcels/status', _middleware.authorizeUser, _parcelsController.changeStatus); //change present location of an order

app.patch('/parcels/location', _middleware.authorizeUser, _parcelsController.changePresentLocation);
app.patch('/parcels/cancel', _middleware.authorizeUser, _parcelsController.cancelParcel);
var _default = app;
exports["default"] = _default;