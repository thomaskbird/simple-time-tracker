import { NextPage } from 'next'
import React, {useEffect, useState} from 'react'
import {ClientType, FilterType, RecordType} from '~/config/types';
import RenderFilters from '~/components/RenderFilters';
import TableHeader from '~/components/TableHeader';
import TableRecord from '~/components/TableRecord';
import config from '~/config/sites';
import {getDocs, QuerySnapshot, where} from '@firebase/firestore';
import {
  collectionRecords,
  makeArrayFromSnapshot,
  queryAllClientsOrdered,
  queryAllRecordsOrdered
} from '~/helpers/firebase';
import moment from 'moment';
import {query} from '@firebase/database';
import TableColumn from '~/components/TableColumn';

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
  const [isAllChecked, setIsAllChecked] = useState(false);

  const retrieveAllRecords = async () => {
    const recordsSnapshot: QuerySnapshot =
      await getDocs(queryAllRecordsOrdered);
    const recordsFromDb = makeArrayFromSnapshot(recordsSnapshot);
    const recordsFromDbWithChecks = recordsFromDb.map(rec => ({ ...rec, isChecked: false }));
    setRecords(recordsFromDbWithChecks);
    setFilteredRecords(recordsFromDbWithChecks);

    const clientSnapshot =
      await getDocs(queryAllClientsOrdered);
    setClients(makeArrayFromSnapshot(clientSnapshot));

    setIsLoading(false);
  }

  useEffect(() => {
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
            <TableHeader
              isAllChecked={isAllChecked}
              onCheckAll={() => {

                const newRecs = [];
                filteredRecords.forEach(rec => {
                  newRecs.push({
                    ...rec,
                    isChecked: !isAllChecked
                  })
                });

                setRecords(newRecs);
                setFilteredRecords(newRecs);

                setIsAllChecked(!isAllChecked)
              }}
            />
            <div>
              {filteredRecords.length === 0 && (
                <div>
                  <TableColumn>No records found...</TableColumn>
                </div>
              )}

              {filteredRecords.length > 0 && filteredRecords.map((record: RecordType) => (
                <TableRecord
                  key={record.id}
                  record={record}
                  onChecked={(recordId, isChecked) => {
                    const newRecs = [];
                    filteredRecords.forEach(rec => {
                      if(rec.id === recordId) {
                        newRecs.push({
                          ...rec,
                          isChecked: isChecked
                        })
                      } else {
                        newRecs.push(rec);
                      }
                    });

                    setRecords(newRecs);
                    setFilteredRecords(newRecs);
                  }}
                  onUpdateRecords={() => retrieveAllRecords()}
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
