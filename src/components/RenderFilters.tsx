import Filter from '~/components/Filter';
import React from 'react';
import {ClientType, FilterType, FilterTypes} from '~/config/types';

interface RenderFiltersType {
  clients: ClientType[];
  filters: FilterType[];
  onHandleFilter(updatedFilter: FilterType): void;
  onSetRecords(clientId: number | string): void;
}

const manageFilterActiveState = (active: any, filterType: FilterTypes) => {
  let filterVal;
  if(filterType === 'mono') {
    if(active === undefined) {
      filterVal = true;
    } else {
      filterVal = undefined;
    }
  } else {
    if(active === undefined) {
      filterVal = true;
    } else if(active) {
      filterVal = false;
    } else {
      filterVal = undefined;
    }
  }

  return filterVal;
}

const RenderFilters = ({ clients, filters, onHandleFilter, onSetRecords }: RenderFiltersType) => {
  return (
    <div className="py-2 px-4">
      <span className="text-gray-400 text-sm">Filters:</span>
      {filters && filters.map(filter => (
        <Filter
          key={filter.id}
          filter={filter}
          onChanged={() => {
            let filterVal = manageFilterActiveState(filter.active, filter.type);

            onHandleFilter( {
              ...filter,
              active: filterVal
            });
          }}
        />
      ))}

      <select
        id="billing"
        name="billing"
        onChange={e=> onSetRecords(e.target.value)}
        className="p-2.5 outline-0 drop-shadow-3xl text-gray-700"
      >
        <option>Select client...</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>{client.name} - {client.code}</option>
        ))}
      </select>
    </div>
  );
};

export default RenderFilters;