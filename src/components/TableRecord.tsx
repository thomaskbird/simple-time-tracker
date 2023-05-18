import moment from 'moment/moment';
import config from '~/config/sites';
import {NewRecordType} from '~/config/types';
import {removeRecord, updateFieldInRecord} from '~/controllers/global';
import Link from 'next/link';
import React from 'react';

interface TableRecordProps {
  record: NewRecordType;
  onUpdateRecords(records: NewRecordType[]): void;
}

const TableRecord = ({record, onUpdateRecords}: TableRecordProps) => {
  const calculateDiff = (diff: number) => {
    return diff / 60;
  }

  return (
    <tr key={record.id}>
      <td className="text-left p-3">{record.clientId}</td>
      <td className="text-left p-3">{record.name}</td>
      <td className="text-left p-3">{record.code}</td>
      <td className="text-left p-3">{record.description}</td>
      <td className="text-left p-3">{moment(record.from.toDate()).format(config.momentFormat)}</td>
      <td className="text-left p-3">{moment(record.to.toDate()).format(config.momentFormat)}</td>
      <td className="text-left p-3">{calculateDiff(moment(record.to.toDate()).diff(record.from.toDate(), 'minutes'))}hrs</td>
      <td className="text-left p-3">
        <span className={record.logged ? 'text-green-400' : 'text-rose-400'}>{record.logged ? 'Logged' : 'Unlogged'}</span><br/>
        <span className={record.paid ? 'text-green-400' : 'text-rose-400'}>{record.paid ? 'Paid' : 'Unpaid'}</span>
      </td>
      <td className="w-40 text-left p-3 flex flex-col">
        <button
          type="button"
          className="text-left"
          onClick={() => {
            const confirmRemoveRecord = confirm('Are you sure you want to remove this record?');
            if(confirmRemoveRecord) {
              const newRecords: NewRecordType[] = removeRecord(record.id);
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
            const newRecords: NewRecordType[] = updateFieldInRecord(record.id, 'logged', !record.logged);
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
            const newRecords: NewRecordType[] = updateFieldInRecord(record.id, 'paid', !record.paid);
            onUpdateRecords(newRecords);
          }}
          title="Paid"
        >
          &#128181; {record.paid ? 'Mark Unpaid' : 'Mark Paid'}
        </button>
      </td>
    </tr>
  )
};

export default TableRecord;