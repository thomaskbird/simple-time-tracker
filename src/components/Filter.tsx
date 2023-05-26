import {FilterType, FilterTypes} from '~/config/types';
import {useTrackerStore} from '~/store/useTrackerStore';
import {selectFilters, selectSetActiveFilter, selectSetFilters} from '~/store/selectors/filters';

export interface FilterProps {
  filter: FilterType;
}

const manageFilterCurrentState = (active: any, filterType: FilterTypes) => {
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

const handleFiltersActiveState = (filters: FilterType[], updatedFilter: FilterType) => {
  const updatedFilters: FilterType[] = [];
  filters.forEach((item: FilterType) => {
    if(item.id === updatedFilter.id) {
      updatedFilters.push({
        ...item,
        ...updatedFilter,
        active: updatedFilter.active
      });
    } else {
      updatedFilters.push({
        ...item,
        active: undefined
      });
    }
  });

  return updatedFilters;
}

const Filter = ({ filter }: FilterProps) => {
  const setActiveFilter = useTrackerStore(selectSetActiveFilter);
  const filters = useTrackerStore(selectFilters);
  const setFilters = useTrackerStore(selectSetFilters);

  const generateLabel = () => {
    if(filter.type === 'mono') {
      switch(filter?.active) {
        case undefined:
          return filter.labels.notDefined;
        default:
          return filter.labels.truthy;
      }
    } else {
      switch(filter?.active) {
        case undefined:
          return filter.labels.notDefined;
        case true:
          return filter.labels.truthy;
        default:
          return filter.labels.falsy;
      }
    }
  }

  return (
    <span
      className={`bg-white drop-shadow-3xl text-sm py-1 px-2.5 mx-1 cursor-pointer`}
      // drop-shadow-3xl
      onClick={() => {
        const newFilterVal = manageFilterCurrentState(filter.active, filter.type);
        const updatedFilter = {
          ...filter,
          active: newFilterVal
        };

        setActiveFilter(updatedFilter);
        setFilters(handleFiltersActiveState(filters, updatedFilter));
      }}
    >
      {generateLabel()}
    </span>
  );
};

export default Filter;