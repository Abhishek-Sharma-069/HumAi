import { db } from '../config/firebase.js';
const articlesCollection = db.collection('articles');

const Article = {
  create: async (data) => {
    const docRef = await articlesCollection.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  },

  findById: async (id) => {
    const doc = await articlesCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  findAll: async () => {
    const snapshot = await articlesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  update: async (id, data) => {
    const docRef = articlesCollection.doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  },

  delete: async (id) => {
    await articlesCollection.doc(id).delete();
    return true;
  }
};

export default Article;