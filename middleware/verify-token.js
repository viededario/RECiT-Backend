// middleware/verify-token.js

import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or malformed.' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Token verification failed.' });
    }

    req.user = decoded;
   
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired.' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token.' });
    } else if (error.name === 'NotBeforeError') {
      res.status(401).json({ error: 'Token not active.' });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export default verifyToken;