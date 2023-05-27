import {NextPage} from 'next';
import Label from '~/components/Label';
import FormGroup from '~/components/FormGroup';
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {addDoc, collection, getDocs, Timestamp} from '@firebase/firestore';
import {firestoreDb, renderFirestoreTimestamp} from '~/helpers/firebase';
import {useRouter} from 'next/router';
import {ClientType} from '~/config/types';
import TableHeaderColumn from '~/components/TableHeaderColumn';
import TableColumn from '~/components/TableColumn';
import {useTrackerStore} from '~/store/useTrackerStore';
import {selectClients, selectSetClients} from '~/store/selectors/clients';
import moment from 'moment';
import config from '~/config/sites';

const clients: NextPage = () => {
  const router = useRouter();
  const clients = useTrackerStore(selectClients);
  const setClients = useTrackerStore(selectSetClients);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const retrieveAllClients = async () => {
      const clientsFromDb: any = [];
      const clientSnapshot = await getDocs(collection(firestoreDb, 'clients'));
      clientSnapshot.forEach((client) => {
        clientsFromDb.push({
          ...client.data(),
          id: client.id,
        })
      });

      setClients(clientsFromDb);
    }

    retrieveAllClients();
  }, []);

  const handleSubmit = async () => {
    await addDoc(collection(firestoreDb, 'clients'), {
      name,
      code,
      created: Timestamp.now()
    });

    router.push('/');
  }

  return (
    <div className="container">
      <div className="py-5 px-6 bg-gray-100 mb-10">
        <div className="flex gap-16">
          <FormGroup>
            <Label id="name">Name:</Label>
            <input
              id="name"
              name="name"
              value={name}
              placeholder="Enter name..."
              className="py-2.5 px-5 outline-0 drop-shadow-3xl z-0 placeholder-gray-300 text-gray-700"
              onChange={e => setName(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label id="code">Code:</Label>
            <input
              id="code"
              name="code"
              value={code}
              placeholder="Enter code..."
              className="py-2.5 px-5 outline-0 drop-shadow-3xl z-0 placeholder-gray-300 text-gray-700"
              onChange={e => setCode(e.target.value)}
            />
          </FormGroup>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-5 py-2.5 bg-emerald-300 rounded transition-all hover:bg-emerald-400 active:bg-emerald-500"
          >
            Submit
          </button>
          <Link href="/">
            <a className="text-gray-400 ml-10 hover:text-gray-600">
              Cancel
            </a>
          </Link>
        </div>
      </div>

      <div className="bg-white">
        <div className="container">
          <div className="bg-gray-500 text-gray-50">
            <div className="flex flex-row">
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Code</TableHeaderColumn>
              <TableHeaderColumn>Created</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </div>
          </div>
          <div>
          {clients.map((client: ClientType) => (
            <div key={client.id} className="flex flex-row">
              <TableColumn>{client.name}</TableColumn>
              <TableColumn>{client.code}</TableColumn>
              <TableColumn>{moment(client.created).format(config.momentFormat)}</TableColumn>
              <TableColumn>TEST</TableColumn>
            </div>
          ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default clients;