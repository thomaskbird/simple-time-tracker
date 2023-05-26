import {RecordType} from '~/config/types';

export interface RecordsSlice {
  recordsState: {
    records: RecordType[],
    filteredRecords: RecordType[],
  },
  setRecords: (records: RecordType[]) => void;
  setFilteredRecords: (records: RecordType[]) => void;
}