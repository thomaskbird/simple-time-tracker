import {StoreState} from '~/store/types';
import {StateCreator} from 'zustand';
import {FiltersSlice} from '~/store/types/filters';
import config from '~/config/sites';
import {FilterType} from '~/config/types';


export const createFiltersSlice: StateCreator<
  StoreState,
  [],
  [],
  FiltersSlice
> = (set) => ({
  filtersState: {
    activeFilter: undefined,
    filters: config.filters
  },
  setActiveFilter: (filter: FilterType) => {
    set((state) => {
      state.filtersState.activeFilter = filter;
      return state;
    })
  },
  setFilters: (filters: FilterType[]) => {
    set((state) => {
      state.filtersState.filters = filters;
      return state;
    })
  }
})