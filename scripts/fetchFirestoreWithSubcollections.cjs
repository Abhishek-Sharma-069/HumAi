const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with service account
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fetchCollectionWithSubcollections(collectionRef) {
  const snapshot = await collectionRef.get();
  const data = {};

  for (const doc of snapshot.docs) {
    data[doc.id] = {
      data: doc.data(),
      subcollections: {}
    };

    // Get all subcollections for this document
    const subcollections = await doc.ref.listCollections();
    for (const subcollection of subcollections) {
      data[doc.id].subcollections[subcollection.id] = 
        await fetchCollectionWithSubcollections(subcollection);
    }
  }

  return data;
}

async function exportFirestore() {
  try {
    const collections = ['users', 'articles', 'health'];
    const data = {};

    for (const collectionName of collections) {
      const collectionRef = db.collection(collectionName);
      data[collectionName] = await fetchCollectionWithSubcollections(collectionRef);
    }

    // Add schema information from existing database.json
    const schemaPath = path.join(__dirname, '..', 'database.json');
    const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    
    const result = {
      collections: {}
    };

    // Preserve schema and indexes information while adding the data
    for (const collectionName in schemaData.collections) {
      result.collections[collectionName] = {
        schema: schemaData.collections[collectionName].schema,
        indexes: schemaData.collections[collectionName].indexes,
        data: data[collectionName] || {}
      };
    }

    // Add any new collections that weren't in the schema
    for (const collectionName in data) {
      if (!result.collections[collectionName]) {
        result.collections[collectionName] = {
          data: data[collectionName]
        };
      }
    }

    const outputPath = path.join(__dirname, '..', 'database.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`Data exported successfully to ${outputPath}`);
    process.exit(0);
  } catch (error) {
    console.error('Error exporting data:', error);
    process.exit(1);
  }
}

exportFirestore();