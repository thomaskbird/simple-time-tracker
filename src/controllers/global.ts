import {IdType, RecordType} from '~/config/types';

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

export const updateFieldInRecord = (id: IdType, field: any, val: any): RecordType[] => {
  const records = getRecordsFromStorage();
  const search = records.find(record => record.id === id);

  if(search) {
    const newRecords = records.filter(record => record.id !== id);
    newRecords.push({
      ...search,
      [field]: val
    });

    localStorage.setItem('records', JSON.stringify(newRecords));
    return newRecords;
  }
}