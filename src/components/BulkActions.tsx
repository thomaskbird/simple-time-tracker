import {useState} from 'react';

interface BulkActionsProps {

}

const buttonClasses = 'outline-0 text-gray-400 text-left hover:bg-gray-50 py-2 px-9';
const BulkActions = ({}: BulkActionsProps) => {
  const [active, setActive] = useState(false);

  return (
    <div className="bg-white drop-shadow-3xl mb-6 mt-2">
      <button type="button" className={`text-gray-500 py-3 px-7 font-semibold w-full text-left border-b-gray-50 ${active ? 'border-b' : ''}`} onClick={() => setActive(!active)}>Bulk Actions</button>
      <div className={`bg-white py-1 ${active ? 'flex flex-col' : 'hidden'}`}>
        <button type="button" className={buttonClasses}>Mark Logged</button>
        <button type="button" className={buttonClasses}>Mark UnLogged</button>
        <button type="button" className={buttonClasses}>Mark Paid</button>
        <button type="button" className={buttonClasses}>Mark UnPaid</button>
      </div>
    </div>
  )
}

export default BulkActions;