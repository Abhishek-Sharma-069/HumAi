import { db } from '../config/firebase.js';
const healthCollection = db.collection('health');

const Health = {
  create: async (data) => {
    const docRef = await healthCollection.add({
      ...data,
      date: new Date(data.date).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  },

  findById: async (id) => {
    const doc = await healthCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  findByUserId: async (userId) => {
    const snapshot = await healthCollection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  update: async (id, data) => {
    const docRef = healthCollection.doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  },

  delete: async (id) => {
    await healthCollection.doc(id).delete();
    return true;
  }
};

export default Health;
