import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { mapStampsToPlatforms } from './utils/utils';

//For env File 
dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3444;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.get('/score', async (req: Request, res: Response) => {
  const apikey = process.env.GITCOIN_API_KEY;
  const base_url = process.env.GITCOIN_BASE_URL;
  if (!apikey || !base_url) {
    console.error('API Key or Base URL is missing');
    return res.status(500).json({
      message: 'API Key or Base URL is missing',
    });
  }
  const { receiver } = req.query;
  if (!receiver) {
    console.error('Receiver address is missing');
    return res.status(400).json({
      message: 'Receiver address is missing',
    });
  }
  console.log('receiver', receiver);
  const stamps_data = (await axios({
    method: 'GET',
    url: `${base_url}/registry/stamps/${receiver}?limit=1000&include_metadata=true`,
    headers: {
      'X-API-KEY': apikey,
    },
  })).data
  // console.log('stamps_data', stamps_data);

  const stampsByPlatform = mapStampsToPlatforms(stamps_data.items);

  // console.log('stampsByPlatform', JSON.stringify(stampsByPlatform));

  const scorerId = process.env.SCORER_ID;
  const address_score = (await axios({
    method: 'POST',
    url: `${base_url}/registry/submit-passport`,
    headers: {
      'X-API-KEY': apikey
    },
    data: {
      address: receiver,
      scorer_id: scorerId,
    },
  })).data;
  // console.log('address_score', address_score);

  res.json({
    stampsToPlatform: stampsByPlatform,
    stampsCount: stamps_data.items.length,
    addressScore: address_score.score,
  });

});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
