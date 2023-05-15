import DateTimePicker from 'react-datetime-picker';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import {useEffect, useState} from 'react';
import config from '~/config/sites';
import FormGroup from '~/components/FormGroup';
import Label from '~/components/Label';
import {findRecordById, updateRecord} from '~/controllers/global';
import {useRouter} from 'next/router';

const Edit = () => {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [clientId, setClientId] = useState<number>(0);
  const [logged, setLogged] = useState(false);
  const [paid, setPaid] = useState(false);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const id = router.query.id;
    const record = findRecordById(id);

    setDescription(record?.description);
    setFrom(record?.from);
    setTo(record?.to);
    setClientId(record?.clientId);
    setLogged(record?.logged);
    setPaid(record?.paid);
    setId(id);
  }, []);

  const handleUpdate = () => {
    updateRecord(id!, { to, from, description, clientId, paid, logged });
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

      <FormGroup isRow={false}>
        <Label id="logged">
          <input
            type="checkbox"
            checked={logged}
            className="w-6"
            onChange={e => setLogged(e.target.checked)}
          />
        </Label>
        Logged?
      </FormGroup>

      <FormGroup isRow={false}>
        <Label id="paid">
          <input
            type="checkbox"
            checked={paid}
            className="w-6"
            onChange={e => setPaid(e.target.checked)}
          />
        </Label>
        Paid?
      </FormGroup>

      <button
        type="button"
        onClick={() => handleUpdate()}
        className="px-5 py-2.5 bg-emerald-300 rounded transition-all hover:bg-emerald-400 active:bg-emerald-500"
      >
        Update
      </button>
    </div>
  )
}

export default Edit;