import {FilterType, SiteTypes} from '~/config/types';
import {clients} from '~/mocks/client_mock';

const filters: FilterType[] = [
  {
    id: 1,
    label: 'Paid',
    val: 'paid',
    active: undefined,
  },
  {
    id: 2,
    label: 'Logged',
    val: 'logged',
    active: undefined,
  },
]

const config: SiteTypes = {
  dateTimeFormat: 'y-MM-dd HH:mm:ss',
  momentFormat: 'YYYY-MM-DD hh:mm:ss',
  clients: clients,
  filters: filters,
};

export default config;