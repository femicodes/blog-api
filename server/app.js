import express from 'express';
import morgan from 'morgan';
import debug from 'debug';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import '@babel/polyfill';
import { config } from 'dotenv';
import api from './routes/index';
import './models/User';

config();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.options('*', cors());

const port = process.env.PORT || 5000;
const debugged = debug('express');

app.use('/api/v1/', api);

app.get('/', (req, res) => res.status(301).redirect('/api/v1'));

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'route is invalid',
  });
});

app.use((err, req, res) => {
  res.status(err.status || 500).json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.listen(port, () => {
  debugged(`Server running on port ${port}`);
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
    debugged('Database connected..');
  });
});

export default app;
