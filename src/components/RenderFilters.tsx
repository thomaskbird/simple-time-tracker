import Filter from '~/components/Filter';
import React from 'react';
import {ClientType} from '~/config/types';
import {useTrackerStore} from '~/store/useTrackerStore';
import {selectFilters} from '~/store/selectors/filters';

interface RenderFiltersType {
  clients: ClientType[];
  onSetRecords(clientId: number | string): void;
}

const RenderFilters = ({ clients, onSetRecords }: RenderFiltersType) => {
  const filters = useTrackerStore(selectFilters);

  return (
    <div className="py-2 px-4">
      <span className="text-gray-400 text-sm">Filters:</span>
      {filters.map(filter => (
        <Filter
          key={filter.id}
          filter={filter}
        />
      ))}

      <select
        id="billing"
        name="billing"
        onChange={e=> onSetRecords(e.target.value)}
        className="w-96 p-2.5 outline-0 drop-shadow-3xl text-gray-700"
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