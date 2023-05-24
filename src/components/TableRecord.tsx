import moment from 'moment/moment';
import config from '~/config/sites';
import {RecordType} from '~/config/types';
import {removeRecord, updateFieldInRecord} from '~/controllers/global';
import Link from 'next/link';
import React, {useState} from 'react';
import TableColumn from '~/components/TableColumn';
import {deleteDoc, doc} from '@firebase/firestore';
import {firestoreDb} from '~/helpers/firebase';

interface TableRecordProps {
  record: RecordType;
  onUpdateRecords(): void;
  onChecked(recordId: string, isChecked: boolean): void;
}

// todo: figure out how we will update single field in record
// todo: figure out how we will delete a record
const TableRecord = ({record, onUpdateRecords, onChecked}: TableRecordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const calculateDiff = (diff: number) => {
    return diff / 60;
  }

  const deleteRecord = async (recordId: string | number) => {
    await deleteDoc(doc(firestoreDb, 'records', recordId));
    onUpdateRecords();
  };

  return (
    <div key={record.id} className="flex flex-row">
      <TableColumn>
        <input type="checkbox" checked={record.isChecked} onChange={() => onChecked(record.id, !record.isChecked)} />
      </TableColumn>
      <TableColumn>{record.name}</TableColumn>
      <TableColumn>{record.code}</TableColumn>
      <TableColumn>{record.description}</TableColumn>
      <TableColumn>{moment(record.from.toDate()).format(config.momentFormat)}</TableColumn>
      <TableColumn>{moment(record.to.toDate()).format(config.momentFormat)}</TableColumn>
      <TableColumn>{calculateDiff(moment(record.to.toDate()).diff(record.from.toDate(), 'minutes'))}hrs</TableColumn>
      <TableColumn stackChildren>
        <p className={record.logged ? 'text-green-400' : 'text-rose-400'}>{record.logged ? 'Logged' : 'Unlogged'}</p>
        <p className={record.paid ? 'text-green-400' : 'text-rose-400'}>{record.paid ? 'Paid' : 'Unpaid'}</p>
      </TableColumn>
      <TableColumn stackChildren width="flex-2x">
        <button
          type="button"
          className="text-left"
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
        <Link href={`/edit/${record.id}`}>&#9997; Edit</Link>
        <button
          type="button"
          disabled={isLoading}
          className="text-left disabled:opacity-20 disabled:cursor-not-allowed"
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
          className="text-left disabled:opacity-20 disabled:cursor-not-allowed"
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