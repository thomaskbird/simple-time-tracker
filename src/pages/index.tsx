import { NextPage } from 'next'
import React, {useEffect, useState} from 'react'
import {RecordType} from '~/config/types';
import {getAllRecords, removeRecord, updateFieldInRecord} from '~/controllers/global';
import {useRouter} from 'next/router';
import moment from 'moment';
import config from '~/config/sites';
import Link from 'next/link';
import Filter from '~/components/Filter';
import RenderFilters from '~/components/RenderFilters';

const IndexView: NextPage = () => {
  const router = useRouter();
  const [records, setRecords] = useState<RecordType[]>([]);

  useEffect(() => setRecords(getAllRecords()), []);

  const calculateDiff = (diff: number) => {
    return diff / 60;
  }

  const handleFilter = (filterField: RecordType, filterVal: any) => {
    console.log('handleFilter()', records, filterField, filterVal);
    const filteredRecords =
      records.filter(record => record[filterField] === filterVal);
    setRecords(filteredRecords);
  }

  return (
    <div className="container">
      <RenderFilters onHandleFilter={(field, val) => handleFilter(field, val)} />

      <table className="container">
        <thead className="border bg-gray-500 text-gray-50">
          <tr>
            <th className="text-left p-3">Client id</th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Code</th>
            <th className="text-left p-3">Description</th>
            <th className="text-left p-3">From</th>
            <th className="text-left p-3">To</th>
            <th className="text-left p-3">Duration</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan={7}>No records found...</td>
            </tr>
          )}

          {records.length > 0 && records.map((record: RecordType) => (
            <tr key={record.id}>
              <td className="text-left p-3">{record.clientId}</td>
              <td className="text-left p-3">{record.name}</td>
              <td className="text-left p-3">{record.code}</td>
              <td className="text-left p-3">{record.description}</td>
              <td className="text-left p-3">{moment(record.from).format(config.momentFormat)}</td>
              <td className="text-left p-3">{moment(record.to).format(config.momentFormat)}</td>
              <td className="text-left p-3">{calculateDiff(moment(record.to).diff(record.from, 'minutes'))}hrs</td>
              <td className="text-left p-3">
                <span className={record.logged ? 'text-green-400' : 'text-rose-400'}>{record.logged ? 'Logged' : 'Unlogged'}</span><br/>
                <span className={record.paid ? 'text-green-400' : 'text-rose-400'}>{record.paid ? 'Paid' : 'Unpaid'}</span>
              </td>
              <td className="text-left p-3 flex flex-col">
                <button
                  type="button"
                  className="text-left"
                  onClick={() => {
                    const confirmRemoveRecord = confirm('Are you sure you want to remove this record?');
                    if(confirmRemoveRecord) {
                      const newRecords: RecordType[] = removeRecord(record.id);
                      setRecords(newRecords);
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
                    setRecords(newRecords);
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
                    setRecords(newRecords);
                  }}
                  title="Paid"
                >
                  &#128181; {record.paid ? 'Mark Unpaid' : 'Mark Paid'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IndexView
