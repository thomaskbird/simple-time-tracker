import {PeriodType} from '~/config/types';

export interface PeriodsSlice {
  periodsState: {
    periods: PeriodType[]
  },
  setPeriods: (periods: PeriodType[]) => void;
}