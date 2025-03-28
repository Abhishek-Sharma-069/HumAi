// const fetch = require('node-fetch');
// const fs = require('fs');
// const path = require('path');

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Firebase project configuration
const config = {
  projectId: 'humai-069s',
  apiKey: process.env.FIREBASE_API_KEY // Will be provided via environment variable
};

async function fetchFirestoreData() {
  try {
    const collections = ['users', 'articles'];
    const data = {};

    for (const collection of collections) {
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${collection}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FIREBASE_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(JSON.parse(result));
      data[collection] = result.documents || [];
    }

    const outputPath = path.join(__dirname, '..', 'database.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Data exported successfully to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching Firestore data:', error);
    process.exit(1);
  }
}

fetchFirestoreData();