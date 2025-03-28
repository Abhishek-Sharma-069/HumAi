const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('../backend/config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollection(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    const data = {};
    
    for (const doc of snapshot.docs) {
      data[doc.id] = doc.data();
      
      // Get subcollections
      const subcollections = await doc.ref.listCollections();
      for (const subcollection of subcollections) {
        const subcollectionData = {};
        const subcollectionSnapshot = await subcollection.get();
        
        subcollectionSnapshot.forEach(subdoc => {
          subcollectionData[subdoc.id] = subdoc.data();
        });
        
        if (!data[doc.id].subcollections) {
          data[doc.id].subcollections = {};
        }
        data[doc.id].subcollections[subcollection.id] = subcollectionData;
      }
    }

    // Write to file
    fs.writeFileSync(
      `./exports/${collectionName}.json`,
      JSON.stringify(data, null, 2)
    );
    
    console.log(`Exported ${collectionName} successfully!`);
  } catch (error) {
    console.error(`Error exporting ${collectionName}:`, error);
  }
}

// Create exports directory if it doesn't exist
if (!fs.existsSync('./exports')){
  fs.mkdirSync('./exports');
}

// Export collections
const collections = ['articles', 'users', 'categories'];
collections.forEach(collection => {
  exportCollection(collection);
});