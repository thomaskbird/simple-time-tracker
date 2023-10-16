import {ReactNode} from 'react';

interface TableColumnProps {
  width?: boolean | string;
  stackChildren?: boolean;
  children?: ReactNode;
}

const TableColumn = ({ width = false, stackChildren = false, children }: TableColumnProps) => {
  return (
    <div className={
      `flex ${width ? width : 'flex-1'} ${stackChildren ? 'flex-col' : 'flex-row'} text-left p-3`
    }>
      {children}
    </div>
  );
};

export default TableColumn;
