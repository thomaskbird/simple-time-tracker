import {getApp, getApps, initializeApp} from '@firebase/app';
import {collection, getFirestore, orderBy} from '@firebase/firestore';
import moment from 'moment';
import config from '~/config/sites';
import {query} from '@firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

const renderFirestoreTimestamp = (timestamp: any) =>
  moment(timestamp.toDate()).format(config.momentFormat);

const makeArrayFromSnapshot = (snap) => {
  const data: any[] = [];
  snap.forEach((item: any) => {
    data.push({
      ...item.data(),
      id: item.id
    });
  })

  return data;
}

let firestoreDb = null;
let timeTracker = null;

try {
  if(!getApps().length) {
    timeTracker = initializeApp(firebaseConfig);
  } else {
    timeTracker = getApp();
  }

  firestoreDb = getFirestore(timeTracker);
} catch(e) {
  console.log('e', e);
}

const collectionRecords = collection(firestoreDb, 'records');
const collectionClients = collection(firestoreDb, 'clients');

const queryAllRecordsOrdered = query(collectionRecords, orderBy('from', 'desc'));

const queryAllClientsOrdered = query(collectionClients, orderBy('created', 'desc'));

export {
  firestoreDb,
  timeTracker,
  renderFirestoreTimestamp,
  collectionRecords,
  collectionClients,
  queryAllRecordsOrdered,
  queryAllClientsOrdered,
  makeArrayFromSnapshot
}