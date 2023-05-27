export type IdType = number | string;
export interface ClientType {
  id: IdType;
  name: string;
  code: string;
  created: any;
}

export interface FilterLabelsType {
  notDefined: string;
  truthy: string;
  falsy?: string;
}

export type FilterTypes = 'mono' | 'dual';

export interface FilterType {
  id: number;
  type: FilterTypes;
  labels: FilterLabelsType;
  val: string;
  active: undefined | boolean;
}

export interface SiteTypes {
  dateTimeFormat: string;
  momentFormat: string;
  filters: FilterType[];
}

export interface RecordType {
  to: any;
  from: any;
  description: string;
  clientId: IdType,
  isChecked?: boolean;
  id: string;
  name: string;
  code: string;
  logged: boolean;
  loggedOn: any;
  paid: boolean;
  paidOn: any;
}

export interface PeriodType {
  id?: string;
  to: any;
  from: any;
  createdOn: any;
}