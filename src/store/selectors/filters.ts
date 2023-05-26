import {StoreState} from '~/store/types';

export const selectActiveFilter = (store: StoreState) => store.filtersState.activeFilter;

export const selectFilters = (store: StoreState) => store.filtersState.filters;

export const selectSetActiveFilter = (store: StoreState) => store.setActiveFilter;

export const selectSetFilters = (store: StoreState) => store.setFilters;