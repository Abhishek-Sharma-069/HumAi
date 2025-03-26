import { db } from '../config/firebase.js';

const usersCollection = db.collection('users');

const User = {
  create: async (data) => {
    const docRef = await usersCollection.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  },

  findById: async (id) => {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  findByEmail: async (email) => {
    const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  update: async (id, data) => {
    const docRef = usersCollection.doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  },

  delete: async (id) => {
    await usersCollection.doc(id).delete();
    return true;
  }
};

export default User;
