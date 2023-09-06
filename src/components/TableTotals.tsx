import TableColumn from '~/components/TableColumn';
import moment from 'moment';
import React from 'react';
import {RecordType} from '~/config/types';
import calculateDiff from '~/helpers/calculateDiff';
import config from '~/config/sites';

interface TableTotalsProps {
  records: RecordType[];
}

const TableTotals = ({ records }: TableTotalsProps) => {
  let totalTime = 0;
  records.forEach(record => {
    const diff = calculateDiff(moment(record.to.toDate()).diff(record.from.toDate(), 'minutes'));
    totalTime += diff;
  });

  const timestamps = records.map(record => ([
    moment(record.to.toDate()).format(config.momentFormatWoTimestamp),
    moment(record.from.toDate()).format(config.momentFormatWoTimestamp)
  ]));
  const uniqVals = [... new Set(timestamps.flat())].sort();
  const startRange = uniqVals[0];
  const endRange = uniqVals[uniqVals.length-1];

  return (
    <div className="flex flex-row bg-gray-50">
      <TableColumn width="flex-0" />
      <TableColumn>Total Records: {records.length}</TableColumn>
      <TableColumn></TableColumn>
      <TableColumn></TableColumn>
      <TableColumn>{startRange}</TableColumn>
      <TableColumn>{endRange}</TableColumn>
      <TableColumn>{totalTime}hrs</TableColumn>
      <TableColumn></TableColumn>
      <TableColumn width="flex-2x"></TableColumn>
    </div>
  )
}

export default TableTotals;
