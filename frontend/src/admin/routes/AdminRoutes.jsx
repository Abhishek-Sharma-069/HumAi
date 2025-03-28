import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ArticleManagement from '../../components/ArticleManagement';
import UserManagement from '../../components/UserManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/articles" element={<ArticleManagement />} />
      <Route path="/users" element={<UserManagement />} />
      <Route index element={
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Admin Dashboard</h1>
          <p className="text-gray-600">Select a section from the navigation above to manage articles or users.</p>
        </div>
      } />
    </Routes>
  );
};

export default AdminRoutes;