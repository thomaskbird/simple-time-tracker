import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  createFiltersSlice,
  createRecordsSlice,
  createPeriodsSlice,
  createClientsSlice,
} from './slices';
import { StoreState } from './types';

export const useTrackerStore = create(
  persist(immer<StoreState>(
    (...a) => ({
      ...createFiltersSlice(...a),
      ...createRecordsSlice(...a),
      ...createPeriodsSlice(...a),
      ...createClientsSlice(...a)
    }),
  ), {
    name: 'time-tracker',
  }),
);
