import React, {ReactNode} from 'react';

interface TableHeaderColumnProps {
  children: ReactNode
}
const TableHeaderColumn = ({ children }: TableHeaderColumnProps) => {
  return <th className="text-left p-3">{children}</th>
};

export default TableHeaderColumn;