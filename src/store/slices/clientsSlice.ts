import {StateCreator} from 'zustand';
import {StoreState} from '~/store/types';
import {ClientsSlice} from '~/store/types/clients';
import {ClientType} from '~/config/types';

export const createClientsSlice: StateCreator<
  StoreState,
  [],
  [],
  ClientsSlice
> = set => ({
  clientsState: {
    clients: [],
  },
  setClients: (clients: ClientType[]) => {
    set((state) => {
      state.clientsState.clients = clients;
      return state;
    })
  }
})