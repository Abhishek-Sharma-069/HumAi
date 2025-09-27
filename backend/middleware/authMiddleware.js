import { auth } from '../config/firebase.js';

const protect = async (req, res, next) => {
  // If Firebase is not configured, skip authentication in production
  if (!auth) {
    console.warn('⚠️ Firebase auth not configured, skipping authentication');
    req.user = { uid: 'demo-user', email: 'demo@example.com', name: 'Demo User' };
    return next();
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split('Bearer ')[1];
      
      if (!token) {
        console.warn('⚠️ No token provided in authorization header');
        return res.status(401).json({ message: 'Not authorized, no token provided' });
      }

      console.log('🔍 Verifying token...');
      const decodedToken = await auth.verifyIdToken(token);
      
      if (!decodedToken.uid) {
        throw new Error('Invalid token payload');
      }

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || null
      };

      console.log('✅ Token verified successfully:', req.user);
      next();
    } catch (error) {
      console.error('❌ Auth Middleware Error:', error.message);
      if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.warn('⚠️ No authorization header provided');
    res.status(401).json({ message: 'Not authorized, no authorization header' });
  }
};

export { protect };
