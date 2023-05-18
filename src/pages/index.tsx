import { NextPage } from 'next'
import React, {useEffect, useState} from 'react'
import {ClientType, FilterType, RecordType} from '~/config/types';
import RenderFilters from '~/components/RenderFilters';
import TableHeader from '~/components/TableHeader';
import TableRecord from '~/components/TableRecord';
import config from '~/config/sites';
import {collection, getDocs, where} from '@firebase/firestore';
import {firestoreDb} from '~/helpers/firebase';
import moment from 'moment';
import {query} from '@firebase/database';

// todo: Need to convert all records to using db id instead field in client record
const IndexView: NextPage = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<RecordType[]>([]);
  const [filters, setFilters] = useState<FilterType[]>(config.filters);
  const [activeFilter, setActiveFilter] = useState<FilterType | undefined>(undefined);
  const [clients, setClients] = useState<ClientType[]>([]);

  useEffect(() => {
    const retrieveAllClients = async () => {
      const clientsFromDb: any = [];
      const clientSnapshot = await getDocs(collection(firestoreDb, 'clients'));
      clientSnapshot.forEach((client) => {
        clientsFromDb.push({
          ...client.data(),
          id: client.id,
        })
      });

      setClients(clientsFromDb);
    }

    retrieveAllClients();
  }, []);

  useEffect(() => {
    const retrieveAllRecords = async () => {
      const recordsFromDb: RecordType[] = [];
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
    const runWeekQuery = async () => {
      const startOfWeek = moment().startOf('week').toDate();
      const filterRecords: RecordType[] = [];

      const weekQuery = query(
        collection(firestoreDb, 'records'),
        where('to', '>', startOfWeek),
      );

      const weekSnapshot = await getDocs(weekQuery);
      weekSnapshot.forEach((rec: any) => {
        filterRecords.push({
          ...rec.data(),
          id: rec.id
        });
      });

      setFilteredRecords(filterRecords);
    };

    if(activeFilter?.active === undefined) {
      setFilteredRecords(records);
    } else {
      const filterRecords: RecordType[] = [];

      if(activeFilter.val === 'week') {
        runWeekQuery();
      } else {
        records.forEach(item => {
          if(item[activeFilter.val] === activeFilter?.active) {
            filterRecords.push(item);
          }
        });
      }

      setFilteredRecords(filterRecords.length ? filterRecords : []);
    }
  }, [filters]);

  const handleFiltersState = (filter: FilterType) => {
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
        clients={clients}
        filters={filters}
        onHandleFilter={updatedFilter => handleFiltersState(updatedFilter)}
        onSetRecords={(clientId) => {
          if(clientId === 'Select client...') {
            setFilteredRecords(records);
          } else {
            const filterRecords: RecordType[] = [];
            records.forEach(item => {
              if(item.clientId === clientId) {
                filterRecords.push(item);
              }
            });

            setFilteredRecords(filterRecords.length ? filterRecords : []);
          }
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

          {filteredRecords.length > 0 && filteredRecords.map((record: RecordType) => (
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
