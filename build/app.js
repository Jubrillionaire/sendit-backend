"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("./routes"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _pg = require("pg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
var client = new _pg.Client({
  connectionString: process.env.DATABASE_URL
});
global.client = client;
client.connect().then(function () {
  console.log("database connected!");
  client.query("CREATE TABLE IF NOT EXISTS users(\n    id serial PRIMARY KEY,\n    first_name VARCHAR NOT NULL,\n    last_name VARCHAR NOT NULL,\n    email VARCHAR UNIQUE NOT NULL,\n    phone_no VARCHAR NOT NULL,\n    password VARCHAR NOT NULL,\n    role VARCHAR DEFAULT 'member'\n   )", function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("users table created");
      client.query("CREATE TABLE IF NOT EXISTS parcels(\n        id serial PRIMARY KEY,\n        user_id INTEGER REFERENCES users(id),\n        pickup_location VARCHAR NOT NULL,\n        destination VARCHAR NOT NULL, \n        recipient_name VARCHAR NOT NULL,\n        recipient_phone_no VARCHAR NOT NULL,\n        status VARCHAR DEFAULT 'pending'\n       )", function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("parcels table created successfully");
        }
      });
    }
  });
})["catch"](function (err) {
  console.log("error connecting to Database", err);
});
app.use("/api/v1", _routes["default"]);
app.all("*", function (req, res) {
  res.send("endpoint does not exist!");
});
var PORT = process.env.PORT || 4000; //running process on the available port

app.listen(PORT, function () {
  console.log("running on port ".concat(PORT));
});
var _default = app;
exports["default"] = _default;