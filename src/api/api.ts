import {
  IDeskproClient,
  ProxyResponse,
  V2ProxyRequestInit,
  proxyFetch,
} from "@deskpro/app-sdk";
import { IncidentNote, ObjectWithSummary, RequestMethod } from "./types";
import { Incident, PaginationIncident } from "../types/Incident";

export const editIncident = async (
  client: IDeskproClient,
  incidentId: string,
  incident: Incident,
  email: string
) => {
  return await installedRequest(
    client,
    `incidents/${incidentId} `,
    "PUT",
    incident,
    {
      From: email,
    }
  );
};

export const getCurrentUser = async (client: IDeskproClient) => {
  return await installedRequest(client, `users/me `, "GET");
};

export const getIncidentNotes = async (
  client: IDeskproClient,
  incidentId: string
): Promise<{ notes: IncidentNote[] }> =>
  installedRequest(client, `incidents/${incidentId}/notes `, "GET");

export const getIncidentsById = async (
  client: IDeskproClient,
  ids: string[]
) => {
  return await Promise.all(ids.map((e) => getIncidentById(client, e)));
};

export const createIncident = async (
  client: IDeskproClient,
  incident: Incident,
  email: string
) => {
  return await installedRequest(client, `incidents `, "POST", incident, {
    From: email,
  });
};

export const getCreateIncidentMeta = async (client: IDeskproClient) => {
  const priorities: ObjectWithSummary = await installedRequest(
    client,
    `priorities `,
    "GET"
  );

  const users: ObjectWithSummary = await installedRequest(
    client,
    `users `,
    "GET"
  );

  const services: ObjectWithSummary = await installedRequest(
    client,
    `services `,
    "GET"
  );

  const data = {
    priority: priorities.priorities.map((e) => ({
      ...e,
      key: e.summary,
      value: e.id,
    })),
    assignments: users.users.map((e) => ({
      ...e,
      key: e.summary,
      value: e.id,
    })),
    services: services.services.map((e) => ({
      ...e,
      key: e.summary,
      value: e.id,
    })),
    urgency: [
      {
        key: "High",
        value: "high",
      },
      {
        key: "Low",
        value: "low",
      },
    ],
    status: [
      {
        key: "Triggered",
        value: "triggered",
      },
      {
        key: "Acknowledged",
        value: "acknowledged",
      },
      {
        key: "Resolved",
        value: "resolved",
      },
    ],
  };

  return data;
};

export const createNote = async (
  client: IDeskproClient,
  incidentId: string,
  note: string,
  email: string
): Promise<Incident[]> => {
  return installedRequest(
    client,
    `incidents/${incidentId}/notes`,
    "POST",
    {
      note: { content: note },
    },
    {
      From: email,
    }
  );
};

export const getIncidentById = (
  client: IDeskproClient,
  id: string
): Promise<{ incident: Incident }> => {
  return installedRequest(client, `incidents/${id} `, "GET");
};

export const getIncidents = (
  client: IDeskproClient,
  page: number,
  incidentKey: string
): Promise<PaginationIncident> => {
  return installedRequest(
    client,
    `incidents?offset=${
      10 * page
    }&statuses[]=triggered&statuses[]=acknowledged&incident_key=${incidentKey}`,
    "GET"
  );
};

const installedRequest = async (
  client: IDeskproClient,
  endpoint: string,
  method: RequestMethod,
  data?: unknown,
  headers?: Record<string, string>
) => {
  const fetch = await proxyFetch(client);

  const options: V2ProxyRequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token token=__api_key__",
      Accept: "application/vnd.pagerduty+json;version=2",
      ...headers,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(
    `https://api.pagerduty.com/${endpoint}`,
    options
  );

  if (isResponseError(response)) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  return response.json();
};

export const isResponseError = (response: ProxyResponse) =>
  response.status < 200 || response.status >= 400;
