import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import testJWTRouter from './controllers/test-jwt.js';
import usersRouter  from './controllers/users.js';
import profilesRouter from './controllers/profiles.js';
import recommendationsRouter from './controllers/recommendations.js';
import cors from 'cors'

mongoose.connect(process.env.MONGODB_URI);

let PORT = process.env.PORT

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(express.json());
app.use(cors())
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/recommendations', recommendationsRouter)


app.listen(PORT, () => {
  console.log('The express app is ready!');
});
