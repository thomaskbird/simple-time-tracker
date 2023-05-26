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
import BulkActions from '~/components/BulkActions';
import {useTrackerStore} from '~/store/useTrackerStore';
import {selectActiveFilter, selectFilters} from '~/store/selectors/filters';
import {
  selectFilteredRecords,
  selectRecords,
  selectSetFilteredRecords,
  selectSetRecords,
} from '~/store/selectors/records';

const IndexView: NextPage = () => {
  const filters = useTrackerStore(selectFilters);
  const setRecords = useTrackerStore(selectSetRecords);
  const setFilteredRecords = useTrackerStore(selectSetFilteredRecords);
  const records = useTrackerStore(selectRecords);
  const filteredRecords = useTrackerStore(selectFilteredRecords);
  const activeFilter = useTrackerStore(selectActiveFilter);

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

  return (
    <div className="container">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <RenderFilters
            clients={clients}
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

          <BulkActions />

          <button
            type="button"
            onClick={() => {
              const jobCodes = filteredRecords.map(rec => rec.code);
              const uniqueJobCodes = [...['Job codes:\n'], ...new Set(jobCodes)];
              console.log(uniqueJobCodes.join('\n'));
            }}
            className="bg-white drop-shadow-3xl px-5 py-2 hover:bg-gray-100"
          >
            Pull codes
          </button>

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
