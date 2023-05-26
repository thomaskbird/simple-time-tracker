import {StateCreator} from 'zustand';
import {StoreState} from '~/store/types';
import {RecordsSlice} from '~/store/types/records';
import {RecordType} from '~/config/types';


export const createRecordsSlice: StateCreator<
  StoreState,
  [],
  [],
  RecordsSlice
> = (set) => ({
  recordsState: {
    records: [],
    filteredRecords: [],
  },
  setRecords: (records: RecordType[]) => {
    set((state) => {
      state.recordsState.records = records;
      return state;
    })
  },
  setFilteredRecords: (records: RecordType[]) => {
    set((state) => {
      state.recordsState.filteredRecords = records;
      return state;
    })
  },
})