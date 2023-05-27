import {ClientType} from '~/config/types';

export interface ClientsSlice {
  clientsState: {
    clients: ClientType[]
  },
  setClients: (periods: ClientType[]) => void;
}