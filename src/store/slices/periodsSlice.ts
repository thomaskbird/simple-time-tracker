import {StateCreator} from 'zustand';
import {StoreState} from '~/store/types';
import {PeriodType} from '~/config/types';
import {PeriodsSlice} from '~/store/types/periods';

export const createPeriodsSlice: StateCreator<
  StoreState,
  [],
  [],
  PeriodsSlice
> = (set) => ({
  periodsState: {
    periods: [],
  },
  setPeriods: (periods: PeriodType[]) => {
    set((state) => {
      state.periodsState.periods = periods;
      return state;
    })
  }
})