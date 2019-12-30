import express from 'express';
import usersRoute from './users-routes';
import parcelRoute from './parcel-routes';

const app = express();

app.use('/', usersRoute);
app.use('/', parcelRoute);

export default app;