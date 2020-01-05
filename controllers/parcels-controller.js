import express from 'express';
import bodyParser from 'body-parser';
import { validationResult } from 'express-validator/check';

const app = express();
app.use(bodyParser.json());

//request for creating parcel for registered users only

export const createParcel = (req, res) => {
  const { user_id, pickup_location, destination, recipient_name, recipient_phone_no } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else if (req.decoded.id === parseInt(user_id, 10)) {
    client.query('INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone_no) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, pickup_location, destination, recipient_name, recipient_phone_no], (err, result) => {
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
    res.status(401).send({ msg: 'Sorry you can not create Parcel Order for another User!' });
  }
};

// //request for getting all parcel if admin or get all parcels by a specific user
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

export const getAllParcels = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const userId = parseInt(req.params.userId, 10);
    if (req.decoded.id === userId) {
      client.query(`SELECT * FROM parcels WHERE user_id = ${userId};`, (err, resp) => {
        if (err) {
          res.send(err);
        } else if (!resp.rows.length) {
          res.status(404).send({ msg: 'You do not have any parcel order yet' });
        } else {
          res.send(resp.rows);
        }
      });
    }else {
      res.status(401).send({ msg: 'Sorry you can not fetch Parcels for another User!' });
    }
  }
}

export const cancelParcel = (req, res) => {
  const { parcelId, user_id } = req.body;

  if(req.decoded.id === parseInt(user_id, 10)){
    client.query(`UPDATE parcels SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING *`, [parcelId, user_id], (err, results) => {
      if(err){
        res.send(err);
        console.log(err)
      }else if(!results.rows[0]){
        res.send({
          msg: "you can not cancel another user's parcel"
        })
      }else {
        res.send({
          success: true,
          msg: "parcel cancelled successfully",
          details: results.rows[0]
        });
      }
    })
  }else {
    res.send("Sorry! You can't cancel parcel for another user");
  }
}



//request for changing destination for a parcel delivery. accessible only by the user that created that parcel
export const changeDestination = (req, res) => {
  const { parcelId, destination, user_id } = req.body;

  if(req.decoded.id === parseInt(user_id, 10)){
    client.query('UPDATE parcels SET destination = $2 WHERE id = $1 AND user_id = $3 RETURNING *', [parcelId, destination, user_id], (err, results) => {
      if(err){
        res.send(err);
      }else if(!results.rows[0]){
        res.send({
          msg: "you can not change Destination for another User!"
        })
      }else{
        res.send({
          success: true,
          msg: "Destination changed successfully",
          details: results.rows[0]
        });
      }
    })
  }else {
    res.send("Sorry! You can't change the destination for another user's parcel");
  }
}

//request for changing status. accessible by the admins only
export const changeStatus = (req, res) => {
  const {status, parcelId} = req.body;

  if(req.decoded.role !== 'admin'){
    res.send({
      msg: 'failed! Only admins can access this endpoint'
    });
  }else {
    client.query('UPDATE Parcels SET status = $1 WHERE id = $2 RETURNING *', [status, parcelId], (err, results) => {
      if(err){
        res.send(err);
      }else{
        res.send({
          msg: 'status changed successfully',
          details: results.rows[0]
        });
      }
    });
  }
}

//request for changing present location. accessible by admins only
export const changePresentLocation = (req, res) => {
  const {location, parcelId} = req.body;

  if(req.decoded.role !== 'admin'){
    res.send({
      msg: 'failed! Only admins can access this endpoint'
    });
  }else {
    client.query('UPDATE Parcels SET pickup_location = $1 WHERE id = $2 RETURNING *', [location, parcelId], (err, results) => {
      if(err){
        res.send(err);
      }else{
        res.send({
          msg: 'present location changed successfully',
          details: results.rows[0]
        });
      }
    });
  }
}


export const getParcels = (req, res) => {
  client.query('SELECT * FROM parcels', (err, parcels) => {
   if (err){
     res.send({msg: "unable to get parcels from database"})
   } else{
     res.send(parcels)
   }
  })
}