import {FilterType, SiteTypes} from '~/config/types';

const filters: FilterType[] = [
  {
    id: 1,
    type: 'dual',
    labels: {
      notDefined: 'Paid Filter',
      truthy: 'Paid',
      falsy: 'Unpaid'
    },
    val: 'paid',
    active: undefined,
  },
  {
    id: 2,
    type: 'dual',
    labels: {
      notDefined: 'Logged Filter',
      truthy: 'Logged',
      falsy: 'Unlogged'
    },
    val: 'logged',
    active: undefined,
  },
  {
    id: 3,
    type: 'mono',
    labels: {
      notDefined: 'Week Filter',
      truthy: 'This week',
    },
    val: 'week',
    active: undefined
  },
  {
    id: 4,
    type: 'mono',
    labels: {
      notDefined: 'Last Week Filter',
      truthy: 'Last week',
    },
    val: 'last-week',
    active: undefined
  }
];

const config: SiteTypes = {
  dateTimeFormat: 'y-MM-dd HH:mm:ss',
  momentFormat: 'YYYY-MM-DD hh:mm:ss',
  filters: filters,
};

export default config;