import express from 'express';
import dotenv from 'dotenv';
import { Emailer } from './emailer';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';

dotenv.config();

const whitelist = [
  "http://localhost:9090",
  "https://maakler-178918.web.app",
  "https://maakler-178918.firebaseapp.com",
  "https://app.moowle.com",
  "https://moowle-dev.web.app",
  "https://moowle-dev.firebaseapp.com",
  "https://stage.moowle.com",
];

const corsOption: CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin as string) !== -1) {
      callback(null, true);
    } else {
      throw new Error("Not allowed by CORS");
    }
  },
  credentials: true,
};

const errorHandler =
  (err: Error, _: express.Request, res: express.Response, next: CallableFunction) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    next();
  };

const app = express();
app.use([
    cors(corsOption),
    errorHandler,
    bodyParser.json()
]);

app.get('/status', (req: express.Request, res: express.Response) => {
  res.send({ status: 'OK'});
});

const emailer: Emailer = new Emailer();
app.post('/email', emailer.sendEmail.bind(emailer));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});