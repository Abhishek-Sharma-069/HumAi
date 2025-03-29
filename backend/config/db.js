import { db } from './firebase.js';

const connectDB = async () => {
  try {
    console.log('🔍 Connecting to Firestore...');
    
    // Test the connection by attempting to access Firestore
    await db.collection('_test_connection').get();
    
    console.log('✅ Firestore Connected');
    
    return db;
  } catch (error) {
    console.error(`❌ Firestore connection error: ${error.message}`);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
