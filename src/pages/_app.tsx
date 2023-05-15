import '../styles/app.css';

import React from 'react'
import { AppProps } from 'next/app'

import { Provider } from 'react-redux';
import { appStore } from '~/redux/app-reducers'
import Header from '~/components/Header';

const COMPONENT_NAME = 'App';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Provider store={appStore}>
    <Header />
    <div className={`${COMPONENT_NAME}`}>
      <div className="page-content container">
        <Component {...pageProps} />
      </div>
    </div>
  </Provider>
)

export default App
