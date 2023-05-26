import {StoreState} from '~/store/types';

export const selectRecords = (store: StoreState) => store.recordsState.records;

export const selectFilteredRecords = (store: StoreState) => store.recordsState.filteredRecords;

export const selectSetRecords = (store: StoreState) => store.setRecords;

export const selectSetFilteredRecords = (store: StoreState) => store.setFilteredRecords;