import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import InputField from './inputBTN/InputField';
import Button from './inputBTN/Button';

const AdminPanel = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState('');
  const [loggedInUsers, setLoggedInUsers] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState(0);

  const db = getFirestore();

  useEffect(() => {
    const fetchArticles = async () => {
      const articlesSnapshot = await getDocs(collection(db, 'articles'));
      setArticles(articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setRegisteredUsers(usersSnapshot.size);
    };

    fetchArticles();
    fetchUsers();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUsers(prev => prev + 1);
      } else {
        setLoggedInUsers(prev => prev - 1);
      }
    });

    return () => unsubscribe();
  }, [db]);

  const handleAddArticle = async () => {
    if (newArticle.trim()) {
      await db.collection('articles').add({ content: newArticle });
      setNewArticle('');
      const articlesSnapshot = await getDocs(collection(db, 'articles'));
      setArticles(articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Articles</h2>
        <ul className="space-y-2 mb-4">
          {articles.map(article => (
            <li key={article.id} className="border p-2 rounded">
              {article.content}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <InputField
            type="text"
            placeholder="New article content"
            value={newArticle}
            onChange={(e) => setNewArticle(e.target.value)}
          />
          <Button onClick={handleAddArticle}>Add Article</Button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
        <p>Logged in users: {loggedInUsers}</p>
        <p>Registered users: {registeredUsers}</p>
      </div>
    </div>
  );
};

export default AdminPanel;
