import { db } from '../config/firebase.js';

class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.isAdmin = data.isAdmin || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async findByEmail(email) {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) return null;
    const userData = snapshot.docs[0].data();
    return new User({ id: snapshot.docs[0].id, ...userData });
  }

  static async create(userData) {
    const usersRef = db.collection('users');
    const docRef = await usersRef.add({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return new User({ id: docRef.id, ...userData });
  }

  static async findById(id) {
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) return null;
    return new User({ id: userDoc.id, ...userDoc.data() });
  }

  async save() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      isAdmin: this.isAdmin,
      updatedAt: new Date()
    };
    if (this.id) {
      await db.collection('users').doc(this.id).update(userData);
    } else {
      const docRef = await db.collection('users').add({
        ...userData,
        createdAt: this.createdAt
      });
      this.id = docRef.id;
    }
    return this;
  }
}


export default User;
