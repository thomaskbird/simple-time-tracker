import React from 'react';
import TableHeaderColumn from '~/components/TableHeaderColumn';

interface TableHeaderProps {}

const TableHeader = ({}: TableHeaderProps) => {
  return (
    <div className="border bg-gray-500 text-gray-50">
      <div className="flex flex-row">
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Code</TableHeaderColumn>
        <TableHeaderColumn>Description</TableHeaderColumn>
        <TableHeaderColumn>From</TableHeaderColumn>
        <TableHeaderColumn>To</TableHeaderColumn>
        <TableHeaderColumn>Duration</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
        <TableHeaderColumn width="flex-2x">Actions</TableHeaderColumn>
      </div>
    </div>
  )
};

export default TableHeader;