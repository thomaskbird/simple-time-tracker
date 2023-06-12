import '../styles/app.css';

import React, {useEffect} from 'react'
import { AppProps } from 'next/app'

import { Provider } from 'react-redux';
import { appStore } from '~/redux/app-reducers'
import Header from '~/components/Header';
import {collection, getDocs} from '@firebase/firestore';
import {firestoreDb} from '~/helpers/firebase';
import {useTrackerStore} from '~/store/useTrackerStore';
import {selectClients, selectSetClients} from '~/store/selectors/clients';
import HydrateZustand from '~/components/HydrateZustand';

const COMPONENT_NAME = 'App';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const clients = useTrackerStore(selectClients);
  const setClients = useTrackerStore(selectSetClients);

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

    if(clients.length === 0) {
      retrieveAllClients();
    }
  }, []);

  return (
    <HydrateZustand>
      <Provider store={appStore}>
        <Header/>
        <div className={`${COMPONENT_NAME}`}>
          <div className="page-content container">
            <Component {...pageProps} />
          </div>
        </div>
      </Provider>
    </HydrateZustand>
  );
}

export default App
