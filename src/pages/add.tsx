import DateTimePicker from 'react-datetime-picker';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import {useState} from 'react';
import config from '~/config/sites';
import FormGroup from '~/components/FormGroup';
import Label from '~/components/Label';
import {addRecord} from '~/controllers/global';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {NextPage} from 'next';

const add: NextPage = () => {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [clientId, setClientId] = useState<undefined | number>(undefined);

  const handleSubmit = () => {
    addRecord({ to, from, description, clientId });
    router.push('/');
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-medium mt-3 mb-6">Enter time:</h1>

      <FormGroup>
        <Label id="description">Description:</Label>
        <input
          id="description"
          name="description"
          value={description}
          placeholder="Description..."
          className="py-2.5 px-5 outline-0 drop-shadow-3xl z-0 placeholder-gray-300 text-gray-700"
          onChange={e => setDescription(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label id="from">From:</Label>
        <DateTimePicker
          id="from"
          value={from}
          format={config.dateTimeFormat}
          onChange={val => {
            setFrom(val);
            setTo(val);
          }}
        />
      </FormGroup>

      <FormGroup>
        <Label id="to">To:</Label>
        <DateTimePicker
          id="to"
          value={to}
          format={config.dateTimeFormat}
          onChange={val => setTo(val)}
        />
      </FormGroup>

      <FormGroup>
        <Label id="billing">Billing:</Label>
        <select
          id="billing"
          name="billing"
          value={clientId}
          onChange={e => setClientId(e.target.value as any as number)}
          className="p-2.5 outline-0 drop-shadow-3xl text-gray-700"
        >
          <option>Select client...</option>
          {config.clients.map(client => (
            <option key={client.id} value={client.id}>{client.name} - {client.code}</option>
          ))}
        </select>
      </FormGroup>

      <div className="flex items-center">
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="px-5 py-2.5 bg-emerald-300 rounded transition-all hover:bg-emerald-400 active:bg-emerald-500"
        >
          Submit
        </button>
        <Link href="/">
          <a className="text-gray-400 ml-10">
            Cancel
          </a>
        </Link>
      </div>
    </div>
  )
}

export default add;