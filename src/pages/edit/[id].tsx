import DateTimePicker from 'react-datetime-picker';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import {useEffect, useState} from 'react';
import config from '~/config/sites';
import FormGroup from '~/components/FormGroup';
import Label from '~/components/Label';
import {useRouter} from 'next/router';
import {collection, doc, getDoc, getDocs, updateDoc} from '@firebase/firestore';
import {firestoreDb} from '~/helpers/firebase';
import Link from 'next/link';
import {ClientType} from '~/config/types';
import sortByKey from '~/helpers/sortByKey';

const Edit = () => {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [clientId, setClientId] = useState<number>(0);
  const [logged, setLogged] = useState(false);
  const [loggedOn, setLoggedOn] = useState(undefined);
  const [paid, setPaid] = useState(false);
  const [paidOn, setPaidOn] = useState(undefined);
  const [id, setId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [queryId, setQueryId] = useState(undefined);

  useEffect(() => {
    const queryParamId: any = router.query.id;
    setQueryId(queryParamId);
  }, []);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const clientsFromDb: any = [];
        const clientSnapshot = await getDocs(collection(firestoreDb, 'clients'));

        const recordRef = await doc(firestoreDb, 'records', queryId!);
        const recordSnapshot = await getDoc(recordRef);
        const record = recordSnapshot.data();

        clientSnapshot.forEach((client) => {
          clientsFromDb.push({
            ...client.data(),
            dbId: client.id,
          })
        });

        setClients(clientsFromDb);

        setDescription(record?.description);
        setFrom(record?.from.toDate());
        setTo(record?.to.toDate());
        setClientId(record?.clientId);
        setLogged(record?.logged);
        setLoggedOn(record?.loggedOn ? record?.loggedOn.toDate() : null);
        setPaid(record?.paid);
        setPaidOn(record?.paidOn ? record?.paidOn.toDate() : null);
        setId(recordSnapshot.id);

        setIsLoading(false);
      } catch (e) {
        console.log('e', e);
      }
    };

    console.log('queryId', queryId);
    if(queryId) {
      retrieveData();
    }
  }, [queryId]);

  const handleUpdate = async () => {
    // updateRecord(id!, { to, from, description, clientId, paid, logged });
    const updatedRecordRef = doc(firestoreDb, 'records', id);

    const client: ClientType = clients.find((c: ClientType) => c.dbId === clientId) || {} as ClientType;

    console.log('client', clients, clientId, client);

    let dataToSend = {
      to: to,
      from: from,
      description: description,
      clientId: clientId,
      name: client?.name,
      code: client?.code,
      logged: logged,
      loggedOn: loggedOn,
      paid: paid,
      paidOn: paidOn
    };

    if(logged) {
      dataToSend.loggedOn = loggedOn;
    }

    if(paid) {
      dataToSend.paidOn = paidOn;
    }

    console.log('dataToSend', dataToSend);

    await updateDoc(updatedRecordRef, dataToSend);
    router.push('/');
  }

  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
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
              {sortByKey(clients, 'code').map((client: ClientType) => (
                <option key={client.id} value={client.dbId}>{client.code} - {client.name}</option>
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

          <FormGroup>
            <Label id="loggedOn">Logged on:</Label>
            <DateTimePicker
              id="loggedOn"
              value={loggedOn}
              format={config.dateTimeFormat}
              onChange={val => setLoggedOn(val)}
            />
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

          <FormGroup>
            <Label id="paidOn">Paid on:</Label>
            <DateTimePicker
              id="paidOn"
              value={paidOn}
              format={config.dateTimeFormat}
              onChange={val => setPaidOn(val)}
            />
          </FormGroup>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleUpdate()}
              className="px-5 py-2.5 bg-emerald-300 rounded transition-all hover:bg-emerald-400 active:bg-emerald-500"
            >
              Update
            </button>
            <Link href="/">
              <a className="text-gray-400 ml-10">
                Cancel
              </a>
            </Link>
          </div>
        </div>
      )}
    </>
  )
};

export default Edit;