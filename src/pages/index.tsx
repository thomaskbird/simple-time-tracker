import { NextPage } from 'next'
import React, {useEffect, useState} from 'react'
import {FilterType, RecordType} from '~/config/types';
import {getAllRecords} from '~/controllers/global';
import RenderFilters from '~/components/RenderFilters';
import TableHeader from '~/components/TableHeader';
import TableRecord from '~/components/TableRecord';
import config from '~/config/sites';
import {collection, doc, setDoc} from '@firebase/firestore';
import {firestoreDb} from '~/helpers/firebase';

const IndexView: NextPage = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [filters, setFilters] = useState<FilterType[]>(config.filters);
  const [activeFilter, setActiveFilter] = useState<FilterType | undefined>(undefined);

  useEffect(() => {
    setRecords(getAllRecords());
  }, []);

  useEffect(() => {
    if(activeFilter?.active === undefined) {
      setRecords(getAllRecords());
    } else {
      const filteredRecords: RecordType[] = [];
      getAllRecords().forEach(item => {
        if(item[activeFilter.val] === activeFilter?.active) {
          filteredRecords.push(item);
        }
      });

      setRecords(filteredRecords.length ? filteredRecords : []);
    }
  }, [filters]);

  const handleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    setFilters((prevState) => {
      const updatedFilters: FilterType[] = [];
      prevState.forEach(item => {
        if(item.id === filter.id) {
          updatedFilters.push({
            ...item,
            ...filter,
            active: filter.active
          });
        } else {
          updatedFilters.push({
            ...item,
            active: undefined
          });
        }
      });

      return updatedFilters;
    });
  }

  const createClient = async () => {
    const client = {
      id: 1,
      name: 'Neurocrine',
      code: 'NEUR0014/49',
    };

    const newClientRef = doc(collection(firestoreDb, 'clients'));
    const clientData = await setDoc(newClientRef, client);
    console.log('clientData', clientData);
  };

  return (
    <div className="container">
      <button
        type="button"
        onClick={() => createClient()}
        className="bg-gray-100 py-3 px-5"
      >
        Create client
      </button>
      <RenderFilters
        filters={filters}
        onHandleFilter={updatedFilter => handleFilter(updatedFilter)}
        onSetRecords={(clientId) => {
          const filteredRecords: RecordType[] = [];
          getAllRecords().forEach(item => {
            console.log(item.clientId, clientId);
            if(item.clientId === clientId) {
              filteredRecords.push(item);
            }
          });

          setRecords(filteredRecords.length ? filteredRecords : []);
        }}
      />

      <table className="container">
        <TableHeader />
        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan={7}>No records found...</td>
            </tr>
          )}

          {records.length > 0 && records.map((record: RecordType) => (
            <TableRecord
              key={record.id}
              record={record}
              onUpdateRecords={newRecords => setRecords(newRecords)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IndexView
