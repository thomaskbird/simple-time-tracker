import {FiltersSlice} from '~/store/types/filters';
import {RecordsSlice} from '~/store/types/records';

export type StoreState =
  FiltersSlice
  & RecordsSlice;
  // & PlayerSlice
  // & IMockSlice
  // & ShareSlice
  // & SearchSlice
  // & SubscriptionModalSlice;
