import React from 'react';
import TableHeaderColumn from '~/components/TableHeaderColumn';

interface TableHeaderProps {
  isAllChecked: boolean;
  onCheckAll(): void;
}

const TableHeader = ({ isAllChecked, onCheckAll }: TableHeaderProps) => {
  return (
    <div className="bg-gray-500 text-gray-50">
      <div className="flex flex-row">
        <TableHeaderColumn>
          <input type="checkbox" onChange={() => onCheckAll()} />
        </TableHeaderColumn>
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