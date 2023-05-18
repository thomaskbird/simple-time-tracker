export type IdType = number | string;
export interface ClientType {
  id: IdType;
  name: string;
  code: string;
  created: any;
}

export interface FilterType {
  id: number;
  label: string;
  val: string;
  active: undefined | boolean;
}

export interface SiteTypes {
  dateTimeFormat: string;
  momentFormat: string;
  clients: ClientType[];
  filters: FilterType[];
}

export interface RecordType {
  to: any;
  from: any;
  description: string;
  clientId: IdType,
  id: string;
  name: string;
  code: string;
  logged: boolean;
  loggedOn: any;
  paid: boolean;
  paidOn: any;
}