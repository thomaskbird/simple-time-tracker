export type IdType = number | string;
export interface ClientType {
  id: IdType;
  name: string;
  code: string;
}

export interface FilterType {
  id: number;
  label: string;
  active: boolean;
}

export interface SiteTypes {
  dateTimeFormat: string;
  momentFormat: string;
  clients: ClientType[];
  filters: FilterType[];
}

export interface RecordType extends Exclude<ClientType, 'id'> {
  clientId: IdType;
  to: Date;
  from: Date;
  description: string;
  logged: boolean;
  paid: boolean;
}