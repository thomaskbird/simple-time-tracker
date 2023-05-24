import {ReactNode} from 'react';

const Label = ({ id, children }: { id: string, children: ReactNode }) => (
  <label htmlFor={id} className="flex flex-col mb-2 mr-2 text-gray-500">{children}</label>
);

export default Label;