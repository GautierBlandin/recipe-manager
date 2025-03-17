import express from 'express';
import serverlessExpress from '@codegenie/serverless-express';

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

export const handler = serverlessExpress({ app });
