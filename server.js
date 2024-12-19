import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import testJWTRouter from './controllers/test-jwt.js';
import usersRouter  from './controllers/users.js';
import profilesRouter from './controllers/profiles.js';
import recommendationsRouter from './controllers/recommendations.js';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(express.json());
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/recommendations', recommendationsRouter)


app.listen(3000, () => {
  console.log('The express app is ready!');
});
