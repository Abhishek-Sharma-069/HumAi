import React, { useState, useEffect } from 'react';
import fetchFirestore from '../utils/fetchFirestore';

const FirestoreData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firestoreData = await fetchFirestore();
        setData(firestoreData);
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
        setError('Failed to fetch Firestore data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading Firestore data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Firestore Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FirestoreData;
