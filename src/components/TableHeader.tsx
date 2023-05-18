import React from 'react';
import TableHeaderColumn from '~/components/TableHeaderColumn';

interface TableHeaderProps {}

const TableHeader = ({}: TableHeaderProps) => {
  return (
    <thead className="border bg-gray-500 text-gray-50">
      <tr>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Code</TableHeaderColumn>
        <TableHeaderColumn>Description</TableHeaderColumn>
        <TableHeaderColumn>From</TableHeaderColumn>
        <TableHeaderColumn>To</TableHeaderColumn>
        <TableHeaderColumn>Duration</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
        <TableHeaderColumn>Actions</TableHeaderColumn>
      </tr>
    </thead>
  )
};

export default TableHeader;