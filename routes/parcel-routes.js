import express from 'express';
import bodyParser from 'body-parser';
import { createParcel, getAllParcels, changeDestination, changeStatus, changePresentLocation, cancelParcel } from '../controllers/parcels-controller.js';
import { check } from 'express-validator/check';
import { authorizeUser } from '../middlewares/middleware.js';

const app = express();

app.use(bodyParser.json());

//create a new parcel order.
app.post('/parcels', [ check('recipient_phone_no', 'Please enter a valid mobile Number').isMobilePhone() ], authorizeUser, createParcel);

//get all parcel orders by a specific user
app.get('/users/:userId/parcels', authorizeUser, getAllParcels);

//change destination of an order
app.patch('/parcels/destination', authorizeUser, changeDestination);

//change status of an order
app.patch('/parcels/status', authorizeUser, changeStatus);

//change present location of an order
app.patch('/parcels/presentLocation', authorizeUser, changePresentLocation);

app.patch('/parcels/cancel', authorizeUser, cancelParcel)

export default app;