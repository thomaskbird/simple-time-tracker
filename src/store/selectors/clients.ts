import {StoreState} from '~/store/types';

export const selectClients = (store: StoreState) => store.clientsState.clients;

export const selectSetClients = (store: StoreState) => store.setClients;