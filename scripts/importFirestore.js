const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('../backend/config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importCollection(collectionName) {
  try {
    const data = JSON.parse(
      fs.readFileSync(`./exports/${collectionName}.json`)
    );

    for (const [docId, docData] of Object.entries(data)) {
      const { subcollections, ...mainData } = docData;
      
      // Import main document
      await db.collection(collectionName).doc(docId).set(mainData);
      
      // Import subcollections if they exist
      if (subcollections) {
        for (const [subName, subData] of Object.entries(subcollections)) {
          for (const [subDocId, subDocData] of Object.entries(subData)) {
            await db
              .collection(collectionName)
              .doc(docId)
              .collection(subName)
              .doc(subDocId)
              .set(subDocData);
          }
        }
      }
    }
    
    console.log(`Imported ${collectionName} successfully!`);
  } catch (error) {
    console.error(`Error importing ${collectionName}:`, error);
  }
}

// Import collections
const collections = ['articles', 'users', 'categories'];
collections.forEach(collection => {
  importCollection(collection);
});
