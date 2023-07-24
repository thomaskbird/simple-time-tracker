import {useState} from 'react';

interface BulkActionsProps {

}

type HandleBulkSelectionType = 'logged' | 'unlogged' | 'paid' | 'unpaid';

interface ActionType {
  id: HandleBulkSelectionType,
  text: string
}

const actions: ActionType[] = [
  {
    id: 'logged',
    text: 'Mark Logged'
  },
  {
    id: 'unlogged',
    text: 'Mark Unlogged'
  },
  {
    id: 'paid',
    text: 'Mark Paid'
  },
  {
    id: 'unpaid',
    text: 'Mark Unpaid'
  },
];

const buttonClasses = 'outline-0 text-gray-400 text-left hover:bg-gray-50 py-2 px-9';
const BulkActions = ({}: BulkActionsProps) => {
  const [active, setActive] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const executeBulkAction = () => {
    const areYouSure = confirm(`Are you sure you want to run this bulk action of ${selectedText}?`);
    if(areYouSure) {
      console.log('executeBulkAction()');
    } else {
      alert('You must confirm this action before proceeding');
    }
  }

  const handleBulkSelection = (actionType: HandleBulkSelectionType) => {
    const txt = actions.find(action => action.id === actionType);
    console.log('handleBulkSelection(action)', txt);
    setActive(false);
    setSelectedText(txt!.text);
  }

  return (
    <div className="bg-white drop-shadow-3xl mb-6 mt-2">
      <button
        type="button"
        className={`text-gray-500 py-3 px-7 font-semibold w-full text-left border-b-gray-50 ${active ? 'border-b' : ''}`}
        onClick={() => setActive(!active)}
      >
        Bulk Actions
        {selectedText && (
          <span className="ml-4 text-gray-400 font-normal text-sm">{selectedText}</span>
        )}
      </button>
      <div className={`bg-white py-1 ${active ? 'flex flex-col' : 'hidden'}`}>
        {actions.map(action => (
          <button
            type="button"
            className={buttonClasses}
            onClick={() => handleBulkSelection(action.id)}
          >
            {action.text}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="text-green-700 absolute top-3 right-6 hover:underline"
        onClick={() => executeBulkAction()}
      >
        Execute
      </button>
    </div>
  );
}

export default BulkActions;