import express from 'express';
import bodyParser from 'body-parser';
import { createUser, userLogin, getUser} from '../controllers/users-controller.js';
import { check } from 'express-validator/check';
import { authorizeUser } from '../middlewares/middleware.js';

const app = express();

app.use(bodyParser.json());

//endpoint  to create User acct
app.post('/users', [
  check('first_name').isAlpha().withMessage('First name must be alphabets only').isLength({min: 3, max: 20}).withMessage('First name be of 3 characters and above'),
  check('email', 'email must be valid').isEmail(),
  check('phone_no', 'Mobile number must be valid').isMobilePhone(),
  check('password')
  .isLength({min: 5}).withMessage('Password must have a minimum length of 5')
], createUser);

//endpoint for logging in
app.post('/users/login', userLogin);

//endpoint for getting user profile details
app.get('/me', authorizeUser, getUser);

export default app;
