"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changePresentLocation = exports.changeStatus = exports.changeDestination = exports.cancelParcel = exports.getAllParcels = exports.createParcel = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _check = require("express-validator/check");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_bodyParser["default"].json()); //request for creating parcel for registered users only

var createParcel = function createParcel(req, res) {
  var _req$body = req.body,
      user_id = _req$body.user_id,
      pickup_location = _req$body.pickup_location,
      destination = _req$body.destination,
      recipient_name = _req$body.recipient_name,
      recipient_phone_no = _req$body.recipient_phone_no;
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  } else if (req.decoded.id === parseInt(user_id, 10)) {
    client.query('INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone_no) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, pickup_location, destination, recipient_name, recipient_phone_no], function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send({
          success: true,
          msg: 'Parcel created successfully!',
          id: result.rows[0].id
        });
      }
    });
  } else {
    res.status(401).send({
      msg: 'Sorry you can not create Parcel Order for another User!'
    });
  }
}; // //request for getting all parcel if admin or get all parcels by a specific user
// export const getAllParcels = (req, res) => {
//   const {userId} = req.body;
//   if (req.decoded.role !== 'admin' && req.decoded.role !== 'member') {
//     res.send("Sorry! Only admins and members have access to this endpoint")
//   } else if (req.decoded.role === 'admin') {
//     client.query('SELECT * from parcels ORDER By id ASC', (err, results) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send(results.rows);
//       }
//     });
//   }else if(req.decoded.role === 'member' && req.decoded.id === parseInt(userId, 10)){
//     client.query('SELECT * FROM parcels WHERE user_id = $1', [userId], (err, results) => {
//       if(err){
//         res.send(err);
//       }else{
//         res.send(results.rows);
//       }
//     });
//   }
//   else {
//     res.send("Please enter valid token");
//   }
// }


exports.createParcel = createParcel;

var getAllParcels = function getAllParcels(req, res) {
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    var userId = parseInt(req.params.userId, 10);

    if (req.decoded.id === userId) {
      client.query("SELECT * FROM parcels WHERE user_id = ".concat(userId, ";"), function (err, resp) {
        if (err) {
          res.send(err);
        } else if (!resp.rows.length) {
          res.status(404).send({
            msg: 'You do not have any parcel order yet'
          });
        } else {
          res.send(resp.rows);
        }
      });
    } else {
      res.status(401).send({
        msg: 'Sorry you can not fetch Parcels for another User!'
      });
    }
  }
};

exports.getAllParcels = getAllParcels;

var cancelParcel = function cancelParcel(req, res) {
  var _req$body2 = req.body,
      parcelId = _req$body2.parcelId,
      user_id = _req$body2.user_id;

  if (req.decoded.id === parseInt(user_id, 10)) {
    client.query("UPDATE parcels SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING *", [parcelId, user_id], function (err, results) {
      if (err) {
        res.send(err);
        console.log(err);
      } else if (!results.rows[0]) {
        res.send({
          msg: "you can not cancel another user's parcel"
        });
      } else {
        res.send({
          success: true,
          msg: "parcel cancelled successfully",
          details: results.rows[0]
        });
      }
    });
  } else {
    res.send("Sorry! You can't cancel parcel for another user");
  }
}; //request for changing destination for a parcel delivery. accessible only by the user that created that parcel


exports.cancelParcel = cancelParcel;

var changeDestination = function changeDestination(req, res) {
  var _req$body3 = req.body,
      parcelId = _req$body3.parcelId,
      destination = _req$body3.destination,
      user_id = _req$body3.user_id;

  if (req.decoded.id === parseInt(user_id, 10)) {
    client.query('UPDATE parcels SET destination = $2 WHERE id = $1 AND user_id = $3 RETURNING *', [parcelId, destination, user_id], function (err, results) {
      if (err) {
        res.send(err);
      } else if (!results.rows[0]) {
        res.send({
          msg: "you can not change Destination for another User!"
        });
      } else {
        res.send({
          success: true,
          msg: "Destination changed successfully",
          details: results.rows[0]
        });
      }
    });
  } else {
    res.send("Sorry! You can't change the destination for another user's parcel");
  }
}; //request for changing status. accessible by the admins only


exports.changeDestination = changeDestination;

var changeStatus = function changeStatus(req, res) {
  var _req$body4 = req.body,
      status = _req$body4.status,
      parcelId = _req$body4.parcelId;

  if (req.decoded.role !== 'admin') {
    res.send({
      msg: 'failed! Only admins can access this endpoint'
    });
  } else {
    client.query('UPDATE Parcels SET status = $1 WHERE id = $2 RETURNING *', [status, parcelId], function (err, results) {
      if (err) {
        res.send(err);
      } else {
        res.send({
          msg: 'status changed successfully',
          details: results.rows[0]
        });
      }
    });
  }
}; //request for changing present location. accessible by admins only


exports.changeStatus = changeStatus;

var changePresentLocation = function changePresentLocation(req, res) {
  var _req$body5 = req.body,
      presentLocation = _req$body5.presentLocation,
      parcelId = _req$body5.parcelId;

  if (req.decoded.role !== 'admin') {
    res.send({
      msg: 'failed! Only admins can access this endpoint'
    });
  } else {
    client.query('UPDATE Parcels SET present_location = $1 WHERE id = $2 RETURNING *', [presentLocation, parcelId], function (err, results) {
      if (err) {
        res.send(err);
      } else {
        res.send({
          msg: 'present location changed successfully',
          details: results.rows[0]
        });
      }
    });
  }
};

exports.changePresentLocation = changePresentLocation;