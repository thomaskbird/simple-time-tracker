import {FilterType} from '~/config/types';

export interface FiltersSlice {
  filtersState: {
    activeFilter: FilterType | undefined,
    filters: FilterType[]
  },
  setActiveFilter: (filter: FilterType) => void;
  setFilters: (filters: FilterType[]) => void;
}