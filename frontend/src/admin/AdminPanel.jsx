import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import Button from '../components/inputBTN/Button';
import { useNavigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!auth.currentUser) {
          console.log('No user authenticated');
          navigate('/login');
          return;
        }

        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists() || userSnap.data().role !== 'admin') {
          console.error('Access denied: User is not an admin');
          setIsAdmin(false);
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error:', error.message);
        setIsAdmin(false);
        navigate('/login');
      }
    };

    checkAdminStatus();


  }, [db, navigate]);

  if (!isAdmin) {
    return null; // Render nothing if the user is not an admin
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <Button onClick={() => navigate('/admin/articles')}>Articles</Button>
          <Button onClick={() => navigate('/admin/users')}>Manage Users</Button>
        </div>

        <AdminRoutes />
      </div>
    </div>
  );
};

export default AdminPanel;
