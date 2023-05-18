import {NextPage} from 'next';
import Label from '~/components/Label';
import FormGroup from '~/components/FormGroup';
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {collection, doc, getDocs, setDoc, Timestamp} from '@firebase/firestore';
import {firestoreDb, renderFirestoreTimestamp} from '~/helpers/firebase';
import {useRouter} from 'next/router';
import {ClientType} from '~/config/types';
import TableHeaderColumn from '~/components/TableHeaderColumn';

const clients: NextPage = () => {
  const router = useRouter();
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const retrieveAllClients = async () => {
      const clientsFromDb: any = [];
      const clientSnapshot = await getDocs(collection(firestoreDb, 'clients'));
      clientSnapshot.forEach((client) => {
        clientsFromDb.push({
          ...client.data(),
          dbId: client.id,
        })
      });

      console.log('clientsFromDb', clientsFromDb);
      setClients(clientsFromDb);
    }

    retrieveAllClients();
  }, []);

  const handleSubmit = async () => {
    const newClientRef = doc(collection(firestoreDb, 'clients'));
    const clientData = await setDoc(newClientRef, {
      id,
      name,
      code,
      created: Timestamp.now()
    });
    console.log('clientData', clientData);
    router.push('/');
  }

  return (
    <div className="container">
      <div className="py-10 px-12 bg-gray-100 mb-10">
        <h3>Clients</h3>

        <FormGroup>
          <Label id="id">Id:</Label>
          <input
            id="id"
            name="id"
            value={id}
            placeholder="Enter ID..."
            className="py-2.5 px-5 outline-0 drop-shadow-3xl z-0 placeholder-gray-300 text-gray-700"
            onChange={e => setId(e.target.value)}
          />
        </FormGroup>

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

      <div className="bg-white">
        <table className="container">
          <thead className="border bg-gray-500 text-gray-50">
            <tr>
              <TableHeaderColumn>Id</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Code</TableHeaderColumn>
              <TableHeaderColumn>Created</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </tr>
          </thead>
          <tbody>
          {clients.map((client: ClientType) => (
            <tr key={client.dbId}>
              <td className="text-left p-3">{client.id}</td>
              <td className="text-left p-3">{client.name}</td>
              <td className="text-left p-3">{client.code}</td>
              <td className="text-left p-3">{renderFirestoreTimestamp(client.created)}</td>
              <td className="text-left p-3"></td>
            </tr>
          ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default clients;