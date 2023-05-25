import {ReactNode} from 'react';

const FormGroup = ({ children, isRow = true }: { children: ReactNode, isRow?: boolean }) => (
  <div className={`flex ${isRow ? 'flex-col' : ''} flex-1 mb-3 `}>{children}</div>
);

export default FormGroup;