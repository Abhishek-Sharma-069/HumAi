import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import LoggerService from './loggerService.js';

class UserService {
  constructor() {
    this.logger = LoggerService;
  }

  async register(userData) {
    try {
      this.logger.info('Registering new user', { email: userData.email });

      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      this.logger.info('User registered successfully', { userId: user._id });

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { user: { ...user.toJSON(), password: undefined }, token };
    } catch (error) {
      this.logger.error('Registration failed', error);
      throw new Error('Registration failed: ' + error.message);
    }
  }

  async login(email, password) {
    try {
      this.logger.info('User login attempt', { email });

      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      this.logger.info('User logged in successfully', { userId: user._id });
      return { user: { ...user.toJSON(), password: undefined }, token };
    } catch (error) {
      this.logger.error('Login failed', error);
      throw new Error('Login failed: ' + error.message);
    }
  }

  async getUserProfile(userId) {
    try {
      this.logger.info('Fetching user profile', { userId });

      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error('Error fetching user profile', error);
      throw new Error('Failed to fetch user profile: ' + error.message);
    }
  }

  async updateUserProfile(userId, updateData) {
    try {
      this.logger.info('Updating user profile', { userId });

      if (updateData.password) {
        const salt = await bcryptjs.genSalt(10);
        updateData.password = await bcryptjs.hash(updateData.password, salt);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      this.logger.info('User profile updated successfully', { userId });
      return user;
    } catch (error) {
      this.logger.error('Error updating user profile', error);
      throw new Error('Failed to update user profile: ' + error.message);
    }
  }
}

export default new UserService();