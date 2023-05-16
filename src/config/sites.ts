import {ClientType, FilterType, SiteTypes} from '~/config/types';

const clients: ClientType[] = [
  {
    id: 1,
    name: 'Neurocrine',
    code: 'NEUR0014/49',
  },
  {
    id: 2,
    name: 'AbbVie',
    code: 'ABBV0053/01',
  },
  {
    id: 3,
    name: 'Internal - Onboarding',
    code: 'SSC0042/04',
  },
  {
    id: 4,
    name: 'Prism Phase 2',
    code: 'SSC0040/07'
  },
  {
    id: 5,
    name: 'New Amsterdam Pharma',
    code: 'NewAm0006/04'
  }
];

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