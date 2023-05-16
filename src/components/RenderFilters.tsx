import Filter from '~/components/Filter';
import React from 'react';
import {FilterType} from '~/config/types';

interface RenderFiltersType {
  filters: FilterType[];
  onHandleFilter(updatedFilter: FilterType): void;
}
const RenderFilters = ({ filters, onHandleFilter }: RenderFiltersType) => {
  return (
    <div className="py-2 px-4">
      <span className="text-gray-400 text-sm">Filters:</span>
      {filters && filters.map(filter => (
        <Filter
          key={filter.id}
          filter={filter}
          onChanged={() => {
            let filterVal = undefined;
            if(filter.active === undefined) {
              filterVal = true;
            } else if(filter.active) {
              filterVal = false;
            } else {
              filterVal = undefined;
            }

            onHandleFilter( {
              ...filter,
              active: filterVal
            });
          }}
        />
      ))}
    </div>
  );
};

export default RenderFilters;