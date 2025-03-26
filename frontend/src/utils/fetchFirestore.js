import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const fetchCollection = async (colRef) => {
  const colDocs = await getDocs(colRef);
  const data = {};

  for (const docSnap of colDocs.docs) {
    const docData = docSnap.data();
    const subCollections = await fetchSubCollections(docSnap.ref);
    data[docSnap.id] = { ...docData, ...subCollections };
  }

  return data;
};

const fetchSubCollections = async (docRef) => {
  const subCollections = await getDocs(collection(docRef, ''));
  const data = {};

  for (const subCol of subCollections.docs) {
    const subColName = subCol.id;
    const subColRef = collection(docRef, subColName);
    data[subColName] = await fetchCollection(subColRef);
  }

  return data;
};

const fetchFirestore = async () => {
  const rootCollections = await getDocs(collection(db, ''));
  const data = {};

  for (const col of rootCollections.docs) {
    const colName = col.id;
    const colRef = collection(db, colName);
    data[colName] = await fetchCollection(colRef);
  }
  console.log(data);
  return data;
};

export default fetchFirestore;
