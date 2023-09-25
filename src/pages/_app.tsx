import '../styles/app.css';

import React, {useEffect} from 'react'
import { AppProps } from 'next/app'

import { Provider } from 'react-redux';
import { appStore } from '~/redux/app-reducers'
import Header from '~/components/Header';
import {useTrackerStore} from '~/store/useTrackerStore';
import {selectClients, selectSetClients} from '~/store/selectors/clients';
import HydrateZustand from '~/components/HydrateZustand';
import {retrieveAllClients} from '~/helpers/firestore';

const COMPONENT_NAME = 'App';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const clients = useTrackerStore(selectClients);
  const setClients = useTrackerStore(selectSetClients);

  useEffect(() => {
    const goGetClientsFromDb = async () => {
      const clientsFromDb = await retrieveAllClients();
      setClients(clientsFromDb);
    }
    // todo: figure out how to appropriately trigger when it should refetch clients
    if(clients.length === 0) {
      console.log('retrieveAllClients()');
      goGetClientsFromDb();
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
