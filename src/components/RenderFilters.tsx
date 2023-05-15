import Filter from '~/components/Filter';
import React from 'react';
import {RecordType} from '~/config/types';

interface RenderFiltersType {
  onHandleFilter(filterField: RecordType, filterVal: any): void;
}
const RenderFilters = ({ onHandleFilter }: RenderFiltersType) => {
  return (
    <div className="py-2 px-4">
      <span className="text-gray-400 text-sm">Filters:</span>
      <Filter label="Paid" onChanged={() => onHandleFilter('paid', true)} />
      <Filter label="Logged" onChanged={() => onHandleFilter('logged', false)} />
    </div>
  );
};

export default RenderFilters;