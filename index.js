import express from 'express';
import authRoutes from './routes/authRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js'
import cors from 'cors';
import dotenv from 'dotenv';
import {PORT} from './config.js';
dotenv.config();
const app = express();


const port = PORT;
// console.log

app.use(cors());

app.use(express.json()); 
// console.log("DB URL:", process.env.JWT_SECRET);

// console.log("Index.js has started");
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

app.use('/auth', authRoutes);
app.use('/reservation', reservationRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});