import { NextPage } from 'next'
import React, {useEffect, useState} from 'react'
import {FilterType, NewRecordType} from '~/config/types';
import RenderFilters from '~/components/RenderFilters';
import TableHeader from '~/components/TableHeader';
import TableRecord from '~/components/TableRecord';
import config from '~/config/sites';
import {collection, getDocs} from '@firebase/firestore';
import {firestoreDb} from '~/helpers/firebase';

const IndexView: NextPage = () => {
  const [records, setRecords] = useState<NewRecordType[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<NewRecordType[]>([]);
  const [filters, setFilters] = useState<FilterType[]>(config.filters);
  const [activeFilter, setActiveFilter] = useState<FilterType | undefined>(undefined);

  useEffect(() => {
    const retrieveAllRecords = async () => {
      const recordsFromDb: NewRecordType[] = [];
      const recordsSnapshot = await getDocs(collection(firestoreDb, 'records'));
      recordsSnapshot.forEach((record: any) => {
        recordsFromDb.push({
          ...record.data(),
          id: record.id
        })
      })
      setRecords(recordsFromDb);
      setFilteredRecords(recordsFromDb);
    }

    retrieveAllRecords();
  }, []);

  useEffect(() => {
    if(activeFilter?.active === undefined) {
      setRecords(records);
    } else {
      const filterRecords: NewRecordType[] = [];
      records.forEach(item => {
        if(item[activeFilter.val] === activeFilter?.active) {
          filterRecords.push(item);
        }
      });

      setFilteredRecords(filterRecords.length ? filterRecords : []);
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

  return (
    <div className="container">
      <RenderFilters
        filters={filters}
        onHandleFilter={updatedFilter => handleFilter(updatedFilter)}
        onSetRecords={(clientId) => {
          const filterRecords: NewRecordType[] = [];
          records.forEach(item => {
            console.log(item.clientId, clientId);
            if(item.clientId === clientId) {
              filterRecords.push(item);
            }
          });

          setFilteredRecords(filterRecords.length ? filterRecords : []);
        }}
      />

      <table className="container">
        <TableHeader />
        <tbody>
          {filteredRecords.length === 0 && (
            <tr>
              <td colSpan={7}>No records found...</td>
            </tr>
          )}

          {filteredRecords.length > 0 && filteredRecords.map((record: NewRecordType) => (
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
