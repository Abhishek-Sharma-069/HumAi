import { auth, db } from '../config/firebase.js';



// @desc Register new user
// @route POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Store additional user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date().toISOString()
    });

    // Generate ID token for the user
    const token = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      _id: userRecord.uid,
      name,
      email,
      token
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ message: 'User already exists' });
    } else if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ message: 'Invalid email format' });
    } else if (error.code === 'auth/weak-password') {
      return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }
    res.status(500).json({ message: 'Error creating user account' });
  }
};

// @desc Login user
// @route POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify user exists in Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    
    // Generate a custom token for client-side sign-in
    const customToken = await auth.createCustomToken(userRecord.uid);

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User data not found' });
    }

    const userData = userDoc.data();

    // Return user data with custom token
    res.json({
      _id: userRecord.uid,
      name: userData.name,
      email: userData.email,
      token: customToken
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({ message: 'Invalid email or password' });
    } else if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    res.status(500).json({ message: 'Error during login process' });
  }
};

// @desc Get user profile
// @route GET /api/users/:id
const getUserProfile = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({
      _id: userDoc.id,
      name: userData.name,
      email: userData.email
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// @desc Update user profile
// @route PUT /api/users/:id
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;

    // Verify user exists in Firebase Auth
    try {
      await auth.getUser(userId);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ message: 'User not found in authentication system' });
      }
      throw error;
    }

    // Update user data in Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found in database' });
    }

    // Prepare Firebase Auth update data
    const authUpdateData = {};
    if (email) authUpdateData.email = email;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters' });
      }
      authUpdateData.password = password;
    }

    // Update Firebase Auth if needed
    if (Object.keys(authUpdateData).length > 0) {
      try {
        await auth.updateUser(userId, authUpdateData);
      } catch (error) {
        if (error.code === 'auth/email-already-exists') {
          return res.status(400).json({ message: 'Email already in use' });
        } else if (error.code === 'auth/invalid-email') {
          return res.status(400).json({ message: 'Invalid email format' });
        }
        throw error;
      }
    }

    // Prepare Firestore update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    updateData.updatedAt = new Date().toISOString();

    // Update in Firestore
    await userRef.update(updateData);

    // Get updated user data
    const updatedUserDoc = await userRef.get();
    const userData = updatedUserDoc.data();

    res.json({
      _id: userId,
      name: userData.name,
      email: userData.email,
      updatedAt: userData.updatedAt
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// @desc Delete user
// @route DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Verify user exists in Firebase Auth
    try {
      await auth.getUser(userId);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ message: 'User not found in authentication system' });
      }
      throw error;
    }

    // Get user from Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Delete from Firebase Auth since Firestore document doesn't exist
      await auth.deleteUser(userId);
      return res.status(404).json({ message: 'User profile not found in database' });
    }

    // Delete from Firebase Auth first
    try {
      await auth.deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user from Firebase Auth:', error);
      throw error;
    }

    // Then delete from Firestore
    await userRef.delete();

    res.json({ message: 'User account successfully deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser };
