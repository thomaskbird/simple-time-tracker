import { NextPage } from 'next'
import React, {useEffect, useState} from 'react'
import {ClientType, FilterType, RecordType} from '~/config/types';
import RenderFilters from '~/components/RenderFilters';
import TableHeader from '~/components/TableHeader';
import TableRecord from '~/components/TableRecord';
import config from '~/config/sites';
import {getDocs, orderBy, where} from '@firebase/firestore';
import {
  collectionClients,
  collectionRecords,
  makeArrayFromSnapshot,
  queryAllClientsOrdered,
  queryAllRecordsOrdered
} from '~/helpers/firebase';
import moment from 'moment';
import {query} from '@firebase/database';

const handleFiltersActiveState = (filters: FilterType[], updatedFilter: FilterType) => {
  const updatedFilters: FilterType[] = [];
  filters.forEach((item: FilterType) => {
    if(item.id === updatedFilter.id) {
      updatedFilters.push({
        ...item,
        ...updatedFilter,
        active: updatedFilter.active
      });
    } else {
      updatedFilters.push({
        ...item,
        active: undefined
      });
    }
  });

  return updatedFilters;
}

const IndexView: NextPage = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<RecordType[]>([]);
  const [filters, setFilters] = useState<FilterType[]>(config.filters);
  const [activeFilter, setActiveFilter] = useState<FilterType | undefined>(undefined);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrieveAllRecords = async () => {
      const recordsSnapshot =
        await getDocs(queryAllRecordsOrdered);
      const recordsFromDb = makeArrayFromSnapshot(recordsSnapshot);
      setRecords(recordsFromDb);
      setFilteredRecords(recordsFromDb);

      const clientSnapshot =
        await getDocs(queryAllClientsOrdered);
      setClients(makeArrayFromSnapshot(clientSnapshot));

      setIsLoading(false);
    }

    retrieveAllRecords();
  }, []);

  useEffect(() => {
    const runWeekQuery = async () => {
      const startOfWeek = moment().startOf('week').toDate();
      const filterRecords: RecordType[] = [];

      const weekQuery = query(
        collectionRecords,
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

    const runLastWeekQuery = async () => {
      const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').toDate()
      const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').toDate();

      const filterRecords: RecordType[] = [];

      const lastWeekQuery = query(
        collectionRecords,
        where('to', '>', startOfLastWeek),
        where('to', '<', endOfLastWeek)
      );

      const lastWeekSnapshot = await getDocs(lastWeekQuery);
      lastWeekSnapshot.forEach((rec: any) => {
        filterRecords.push({
          ...rec.data(),
          id: rec.id
        });
      });

      setFilteredRecords(filterRecords);
    }

    if(activeFilter?.active === undefined) {
      setFilteredRecords(records);
    } else {
      const filterRecords: RecordType[] = [];

      if(activeFilter.val === 'week') {
        runWeekQuery();
      } else if(activeFilter.val === 'last-week') {
        runLastWeekQuery();
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

  const handleUpdateFiltersState = (filter: FilterType) => {
    setActiveFilter(filter);
    setFilters((prevState) => handleFiltersActiveState(prevState, filter));
  };

  return (
    <div className="container">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <RenderFilters
            clients={clients}
            filters={filters}
            onHandleFilter={updatedFilter => handleUpdateFiltersState(updatedFilter)}
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

          <div className="container">
            <TableHeader />
            <div>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default IndexView
