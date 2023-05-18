import React, {ReactNode} from 'react';

interface TableHeaderColumnProps {
  width?: boolean | string;
  children: ReactNode;
}
const TableHeaderColumn = ({ width = false, children }: TableHeaderColumnProps) => {
  return <div className={`${width ? width : 'flex-1'} text-left p-3`}>{children}</div>
};

export default TableHeaderColumn;