import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  createFiltersSlice,
  createRecordsSlice
} from './slices';
import { StoreState } from './types';

export const useTrackerStore = create(
  persist(immer<StoreState>(
    (...a) => ({
      ...createFiltersSlice(...a),
      ...createRecordsSlice(...a),
    }),
  ), {
    name: 'time-tracker',
    // You should be same keys or use merge and migrate functions see zustand docs for details
    partialize: (state) => ({
      filterState: state.filtersState,
      recordsState: state.recordsState
    }),
  }),
);
