import { NextPage } from 'next'
import React, {useEffect, useState} from 'react'
import {ClientType, RecordType} from '~/config/types';
import RenderFilters from '~/components/RenderFilters';
import TableHeader from '~/components/TableHeader';
import TableRecord from '~/components/TableRecord';
import {doc, getDocs, QuerySnapshot, Timestamp, where, writeBatch} from '@firebase/firestore';
import {
  collectionRecords,
  firestoreDb,
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
import {makeArrayFromSnapshot, makeNewFilteredArray, makeNewFilteredArrayWithUpdatedVal} from '~/helpers/makeNewArray';
import TableTotals from '~/components/TableTotals';
import config from '~/config/sites';
import calculateDiff from '~/helpers/calculateDiff';

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
    console.log('recordsFromDbWithChecks', recordsFromDbWithChecks);
    setRecords(recordsFromDbWithChecks);
    setFilteredRecords(recordsFromDbWithChecks);

    const clientSnapshot =
      await getDocs(queryAllClientsOrdered);
    setClients(makeArrayFromSnapshot(clientSnapshot));

    setIsLoading(false);
  }

  const handleBulkAction = async (field: keyof RecordType, val: any) => {
    const checkedRecords = filteredRecords.filter(record => record.isChecked);
    const checkedRecordsIds = checkedRecords.map(rec => rec.id);

    if(checkedRecordsIds.length) {
      const batch = writeBatch(firestoreDb);

      checkedRecordsIds.forEach((id) => {
        const docRef = doc(firestoreDb, 'records', id);
        console.log('docRef', docRef, field, val, `${field}On`, Timestamp.now())
        batch.update(docRef, {
          [field]: val,
          [`${field}On`]: Timestamp.now()
        });
      });

      await batch.commit();
      retrieveAllRecords();
    } else {
      alert('You have to select at least one record to use this action');
    }
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

          <BulkActions
            onBulkAction={(selectedText: string) => {
              const areYouSure = confirm(`Are you sure you want to run this bulk action of ${selectedText}?`);
              if(areYouSure) {
                console.log('executeBulkAction()s', selectedText, filteredRecords.filter(record => record.isChecked));

                if(selectedText === 'Mark Logged') {
                  handleBulkAction('logged', true);
                } else if(selectedText === 'Mark Unlogged') {
                  handleBulkAction('logged', false);
                } else if(selectedText === 'Mark Paid') {
                  handleBulkAction('paid', true);
                } else {
                  handleBulkAction('paid', false);
                }
              } else {
                alert('You must confirm this action before proceeding');
              }
            }}
          />

          <div>
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
            <button
              type="button"
              onClick={() => {
                let calculatedData: any = {};
                const allDates = filteredRecords.map(
                  rec => moment(rec.from.toDate()).format(config.momentFormatWoTimestamp)
                );
                const uniqueDates = [...new Set(allDates)];

                uniqueDates.forEach(uniqueDate => {
                  const matches = filteredRecords
                    .filter(
                      rec => moment(rec.from.toDate()).format(config.momentFormatWoTimestamp) === uniqueDate
                    );

                  let total = 0;
                  matches.forEach(match => {
                    const sub = calculateDiff(moment(match.to.toDate()).diff(match.from.toDate(), 'minutes'));
                    total += sub;
                  })

                  calculatedData[uniqueDate] = total;
                  console.log(`${moment(uniqueDate).format(config.dayFormat)} ${uniqueDate}`, total);
                });

                // console.log('calculatedData', calculatedData);
              }}
              className="bg-white drop-shadow-3xl px-5 py-2 hover:bg-gray-100"
            >
              Pull Hours/day
            </button>
          </div>

          <div className="container">
            <TableHeader
              isAllChecked={isAllChecked}
              onCheckAll={() => {

                const newRecs: RecordType[] =
                  makeNewFilteredArray<RecordType>(
                    filteredRecords,
                    'isChecked',
                    !isAllChecked
                  );

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
                    const newRecs: RecordType[] = makeNewFilteredArrayWithUpdatedVal(
                      filteredRecords,
                      'id',
                      'isChecked',
                      recordId,
                      isChecked
                    );

                    setRecords(newRecs);
                    setFilteredRecords(newRecs);
                  }}
                  onUpdateRecords={() => retrieveAllRecords()}
                />
              ))}

              <TableTotals records={filteredRecords} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default IndexView
