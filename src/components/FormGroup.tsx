import {ReactNode} from 'react';

const FormGroup = ({ children, isRow = true }: { children: ReactNode, isRow?: boolean }) => (
  <div className={`flex ${isRow ? 'flex-col' : ''} mb-10`}>{children}</div>
);

export default FormGroup;