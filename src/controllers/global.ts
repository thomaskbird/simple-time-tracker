import {IdType, RecordType} from '~/config/types';
import { v4 as uuidv4 } from 'uuid';
import config from '~/config/sites';

const getRecordsFromStorage = (): RecordType[] => {
  return JSON.parse(localStorage.getItem('records')!) || [];
}
export const getClientById = (clientId: number) =>
  config.clients.find(client => client.id === clientId);

export const addRecord = (record: RecordType) => {
  const existingRecords = getRecordsFromStorage();
  const clientInfo = getClientById(Number(record.clientId));

  existingRecords.push({
    ...record,
    id: uuidv4(),
    name: clientInfo!.name,
    code: clientInfo!.code,
    logged: false,
    paid: false
  });
  localStorage.setItem('records', JSON.stringify(existingRecords));
};

export const getAllRecords = () => {
  return getRecordsFromStorage();
}

export const findRecordById = id => {
  const records = getRecordsFromStorage();
  return records.find(record => record.id === id);
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

export const updateFieldInRecord = (id: IdType, field: any, val: any) => {
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

export const updateRecord = (id: IdType, record: RecordType) => {
  const records = getRecordsFromStorage();
  const search = findRecordById(id);

  if(search) {
    const newRecords = records.filter(record => record.id !== id);
    newRecords.push({
      ...search,
      ...record
    });

    localStorage.setItem('records', JSON.stringify(newRecords));
    return newRecords;
  }
}

export const reformatTimestamps = () => {
  const records = getRecordsFromStorage();

}