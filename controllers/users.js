// /controllers/users.js
import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import verifyToken from '../middleware/verify-token.js';

const SALT_LENGTH = 12;

router.post('/signup', async (req, res) => {
    try {
      const userInDatabase = await User.findOne({ username: req.body.username });
      if (userInDatabase) {
        return res.json({ error: 'Username already taken.' });
      }
      const user = await User.create({
        name: req.body.name,
        username: req.body.username,
        hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH),
      });
      const token = jwt.sign(
        { username: user.username, _id: user._id },
        process.env.JWT_SECRET
      );
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

router.post('/signin', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
        const token = jwt.sign(
          { username: user.username, _id: user._id },
          process.env.JWT_SECRET
        );
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: 'Invalid username or password.' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default router;
