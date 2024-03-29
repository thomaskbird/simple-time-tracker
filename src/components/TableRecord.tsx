import moment from 'moment/moment';
import config from '~/config/sites';
import {RecordType} from '~/config/types';
import {removeRecord, updateFieldInRecord} from '~/controllers/global';
import Link from 'next/link';
import React, {useState} from 'react';
import TableColumn from '~/components/TableColumn';
import {deleteDoc, doc} from '@firebase/firestore';
import {firestoreDb} from '~/helpers/firebase';
import calculateDiff from '~/helpers/calculateDiff';

interface TableRecordProps {
  record: RecordType;
  onUpdateRecords(): void;
  onChecked(recordId: string, isChecked: boolean): void;
}

// todo: figure out how we will update single field in record
// todo: figure out how we will delete a record
const TableRecord = ({record, onUpdateRecords, onChecked}: TableRecordProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteRecord = async (recordId: string | number) => {
    await deleteDoc(doc(firestoreDb, 'records', recordId));
    onUpdateRecords();
  };

  const hoursForEntry = calculateDiff(moment(record.to.toDate()).diff(record.from.toDate(), 'minutes')).toFixed(1);

  return (
    <div key={record.id} className="flex flex-row">
      <TableColumn width="flex-0">
        <input type="checkbox" checked={record.isChecked} onChange={() => onChecked(record.id, !record.isChecked)} />
      </TableColumn>
      <TableColumn>{record.name}</TableColumn>
      <TableColumn>{record.code}</TableColumn>
      <TableColumn>{record.description}</TableColumn>
      <TableColumn>{moment(record.from.toDate()).format(config.momentFormat)}</TableColumn>
      <TableColumn>{moment(record.to.toDate()).format(config.momentFormat)}</TableColumn>
      <TableColumn>{hoursForEntry}hrs</TableColumn>
      <TableColumn>${(parseFloat(hoursForEntry) * config.hourlyRate).toFixed(2)}</TableColumn>
      <TableColumn stackChildren>
        <p className={record.logged ? 'text-green-400' : 'text-rose-400'}>{record.logged ? 'Logged' : 'Unlogged'}</p>
        <p className={record.paid ? 'text-green-400' : 'text-rose-400'}>{record.paid ? 'Paid' : 'Unpaid'}</p>
      </TableColumn>
      <TableColumn stackChildren width="flex-2x">
        <button
          type="button"
          className="text-left py-1"
          onClick={() => {
            setIsLoading(true);
            const confirmRemoveRecord = confirm('Are you sure you want to remove this record?');
            if(confirmRemoveRecord) {
              setIsLoading(true);
              deleteRecord(record.id);
              setIsLoading(false);
            }
          }}
        >
          &#128163; Remove
        </button>
        <Link className="py-1" href={`/edit/${record.id}`}>&#9997; Edit</Link>
        <button
          type="button"
          disabled={isLoading}
          className="text-left disabled:opacity-20 disabled:cursor-not-allowed py-1"
          onClick={async () => {
            setIsLoading(true);
            await updateFieldInRecord(record.id, 'logged', !record.logged);
            onUpdateRecords();
            setIsLoading(false);
          }}
          title="Logged hours"
        >
          &#128203; {record.logged ? 'Mark Unlogged' : 'Mark Logged'}
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="text-left disabled:opacity-20 disabled:cursor-not-allowed py-1"
          onClick={async () => {
            setIsLoading(true);
            await updateFieldInRecord(record.id, 'paid', !record.paid);
            onUpdateRecords();
            setIsLoading(false);
          }}
          title="Paid"
        >
          &#128181; {record.paid ? 'Mark Unpaid' : 'Mark Paid'}
        </button>
      </TableColumn>
    </div>
  )
};

export default TableRecord;
