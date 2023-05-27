import {StoreState} from '~/store/types';

export const selectPeriods = (store: StoreState) => store.periodsState.periods;

export const selectSetPeriods = (store: StoreState) => store.setPeriods;