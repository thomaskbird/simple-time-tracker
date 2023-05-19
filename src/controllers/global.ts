import {IdType, RecordType} from '~/config/types';
import {doc, Timestamp, updateDoc} from '@firebase/firestore';
import {firestoreDb} from '~/helpers/firebase';

const getRecordsFromStorage = (): RecordType[] => {
  return JSON.parse(localStorage.getItem('records')!) || [];
}

export const removeRecord = (id: IdType) => {
  const records = getRecordsFromStorage();
  const search = records.find(record => record.id === id);

  if(search) {
    const newRecords = records.filter(record => record.id !== id);
    localStorage.setItem('records', JSON.stringify(newRecords));
    return newRecords;
  }
};

export const updateFieldInRecord = async (id: IdType, field: any, val: any): void => {
  const timestampToUpdate = field === 'paid' ? 'paidOn' : 'loggedOn';
  const updatedRecordRef = doc(firestoreDb, 'records', id);
  await updateDoc(updatedRecordRef, {
    [field]: val,
    [timestampToUpdate]: val ? Timestamp.now() : null
  });
}