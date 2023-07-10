/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export type APIArrayReturnTypes = IContact & IActivityNote & IOpportunity;

export interface IContact {
  id: number;
  name: string;
  prefix: null;
  first_name: string;
  middle_name: null;
  last_name: string;
  suffix: null;
  address: Address;
  assignee_id: number;
  assignee_name?: string;
  company_id: number;
  company_name: string;
  contact_type_id: number;
  details: string;
  emails: Email[];
  phone_numbers: PhoneNumber[];
  socials: any[];
  tags: any[];
  title: string;
  websites: Website[];
  custom_fields: any[];
  date_created: number;
  date_modified: number;
  date_last_contacted: number;
  interaction_count: number;
  leads_converted_from: any[];
  date_lead_created: null;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: null;
}

export interface Email {
  email: string;
  category: string;
}

export interface PhoneNumber {
  number: string;
  category: string;
}

export interface Website {
  url: string;
  category: string;
}

export interface IActivityNote {
  id: number;
  parent: Parent;
  type: Type;
  user_id: number;
  details: string;
  activity_date: number;
  old_value: null;
  new_value: null;
  date_created: number;
  date_modified: number;
}

export interface Parent {
  id: number;
  type: string;
}

export interface Type {
  id: number;
  category: string;
}

export interface IOpportunity {
  id: number;
  name: string;
  assignee_id: number;
  close_date: string;
  company_id: number;
  company_name: string;
  customer_source_id: null;
  details: string;
  loss_reason_id: null;
  pipeline_id: number;
  pipeline_stage_id: number;
  primary_contact_id: number;
  priority: string;
  status: string;
  tags: any[];
  interaction_count: number;
  monetary_unit: string;
  monetary_value: number;
  converted_unit: string;
  converted_value: string;
  win_probability: number;
  date_stage_changed: number;
  date_last_contacted: number;
  leads_converted_from: any[];
  date_lead_created: null;
  date_created: number;
  date_modified: number;
  custom_fields: any[];
}

export interface IPipelineStage {
  id: number;
  name: string;
  pipeline_id: number;
  win_probability: null;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
}
