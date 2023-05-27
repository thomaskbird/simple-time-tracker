import {FiltersSlice} from '~/store/types/filters';
import {RecordsSlice} from '~/store/types/records';
import {PeriodsSlice} from '~/store/types/periods';
import {ClientsSlice} from '~/store/types/clients';

export type StoreState =
  FiltersSlice
  & RecordsSlice
  & PeriodsSlice
  & ClientsSlice;
