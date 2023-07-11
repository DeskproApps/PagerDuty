export interface PaginationIncident {
  incidents: Incident[];
  limit: number;
  offset: number;
  total: null;
  more: boolean;
}

export interface Incident {
  incident_number: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: string;
  linked_tickets?: string;
  incident_key: string;
  service: EscalationPolicy;
  assignments: Assignment[];
  assigned_via: string;
  last_status_change_at: string;
  resolved_at: null;
  first_trigger_log_entry: EscalationPolicy;
  alert_counts: AlertCounts;
  is_mergeable: boolean;
  escalation_policy: EscalationPolicy;
  teams: any[];
  pending_actions: any[];
  acknowledgements: Acknowledgement[];
  basic_alert_grouping: null;
  alert_grouping: null;
  last_status_change_by: EscalationPolicy;
  priority: Priority | null;
  incidents_responders: IncidentsResponder[];
  responder_requests: ResponderRequest[];
  subscriber_requests: any[];
  urgency: string;
  id: string;
  type: string;
  summary: string;
  self: string;
  html_url: string;
}

export interface Acknowledgement {
  at: string;
  acknowledger: EscalationPolicy;
}

export interface EscalationPolicy {
  id: string;
  type: string;
  summary: string;
  self: string;
  html_url: string;
}

export interface AlertCounts {
  all: number;
  triggered: number;
  resolved: number;
}

export interface Assignment {
  at: string;
  assignee: EscalationPolicy;
  summary: string;
}

export interface IncidentsResponder {
  state: string;
  user: Requester;
  incident: EscalationPolicy;
  updated_at: string;
  message: string;
  requester: Requester;
  requested_at: string;
}

export interface Requester {
  id: string;
  type: string;
  summary: string;
  self: string;
  html_url: string;
  avatar_url: string;
  job_title: null;
}

export interface Priority {
  id: string;
  type: string;
  summary: string;
  self: string;
  html_url: null;
  account_id: string;
  color: string;
  created_at: string;
  description: string;
  name: string;
  order: number;
  schema_version: number;
  updated_at: string;
}

export interface ResponderRequest {
  incident: EscalationPolicy;
  requester: EscalationPolicy;
  requested_at: string;
  message: string;
  responder_request_targets: ResponderRequestTargetElement[];
}

export interface ResponderRequestTargetElement {
  responder_request_target: ResponderRequestTargetResponderRequestTarget;
}

export interface ResponderRequestTargetResponderRequestTarget {
  type: string;
  id: string;
  summary: null;
  incidents_responders: IncidentsResponder[];
}
