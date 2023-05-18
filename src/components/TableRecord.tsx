import moment from 'moment/moment';
import config from '~/config/sites';
import {RecordType} from '~/config/types';
import {removeRecord, updateFieldInRecord} from '~/controllers/global';
import Link from 'next/link';
import React from 'react';
import TableColumn from '~/components/TableColumn';

interface TableRecordProps {
  record: RecordType;
  onUpdateRecords(records: RecordType[]): void;
}

// todo: figure out how we will update single field in record
const TableRecord = ({record, onUpdateRecords}: TableRecordProps) => {
  const calculateDiff = (diff: number) => {
    return diff / 60;
  }

  return (
    <div key={record.id} className="flex flex-row">
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
            const confirmRemoveRecord = confirm('Are you sure you want to remove this record?');
            if(confirmRemoveRecord) {
              const newRecords: RecordType[] = removeRecord(record.id);
              onUpdateRecords(newRecords);
            }
          }}
        >
          &#x10102; Remove
        </button>
        <Link href={`/edit/${record.id}`}>&#9997; Edit</Link>
        <button
          type="button"
          className="text-left"
          onClick={() => {
            const newRecords: RecordType[] = updateFieldInRecord(record.id, 'logged', !record.logged);
            onUpdateRecords(newRecords);
          }}
          title="Logged hours"
        >
          &#128203; {record.logged ? 'Mark Unlogged' : 'Mark Logged'}
        </button>
        <button
          type="button"
          className="text-left"
          onClick={() => {
            const newRecords: RecordType[] = updateFieldInRecord(record.id, 'paid', !record.paid);
            onUpdateRecords(newRecords);
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