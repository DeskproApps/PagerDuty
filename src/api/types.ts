/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

type ObjectTypes = "priorities" | "users" | "services";

export type ObjectWithSummary = {
  [key in ObjectTypes]: { id: string; summary: string }[];
};

export interface IncidentNote {
  id: string;
  user: Channel;
  channel: Channel;
  content: string;
  created_at: string;
}

export interface Channel {
  summary: string;
  id?: string;
  type?: string;
  self?: string;
  html_url?: string;
}

export interface PagerDutyErrorResponse{
  error?:{
    message: string
  }
}