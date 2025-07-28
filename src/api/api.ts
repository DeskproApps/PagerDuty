import {
  IDeskproClient,
  proxyFetch,
} from "@deskpro/app-sdk";
import { AUTH_URL, placeholders } from "../constants";
import { IncidentNote, ObjectWithSummary, PagerDutyErrorResponse, RequestMethod } from "./types";
import { Incident, PaginationIncident } from "../types/Incident";

export const getAccessTokenService = async (
  client: IDeskproClient,
  { code, redirectUri }: { code: string, redirectUri: string },
) => {
  const fetch = await proxyFetch(client);
  const data = new FormData();
  data.append("grant_type", "authorization_code");
  data.append("client_id", placeholders.CLIENT_ID);
  data.append("client_secret", placeholders.CLIENT_SECRET);
  data.append("redirect_uri", redirectUri);
  data.append("code", code);


  const response = await fetch(`${AUTH_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: (new URLSearchParams(data as never)).toString(),
  });

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

export const checkAuthService = getCurrentUser;

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
    `incidents?offset=${10 * page
    }&statuses[]=triggered&statuses[]=acknowledged&statuses[]=resolved&incident_key=${incidentKey}&date_range=all&limit=100`,
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

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${placeholders.ACCESS_TOKEN}`,
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

  // Handle errors 
  if (isResponseError(response)) {
    if (isJsonErrorResponse(response)) {
      const errorData = await response.json() as PagerDutyErrorResponse
      const errorMessage = errorData?.error?.message ?? getErrorMessageForStatusCode(response.status)
      throw new Error(errorMessage)
    }

    const errorMessage = getErrorMessageForStatusCode(response.status)
    throw new Error(errorMessage)
  }

  return response.json();
};

export function isResponseError(response: Response): boolean {
  return response.status < 200 || response.status >= 400;
}

export function isJsonErrorResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type")

  return contentType !== null && contentType.includes("application/json")
}

function getErrorMessageForStatusCode(statusCode: Response["status"]): string {
  // Source: https://developer.pagerduty.com/docs/errors  (HTTP Responses)
  switch (statusCode) {
    case 400:
      return "Bad Request: The server couldn't process your request due to invalid input."

    case 401:
      return "Authentication Required: Please log in and try again."

    case 402:
      return "Payment Required: The PagerDuty account does not have access to one or more abilities needed to complete this request."

    case 403:
      return "Authorization error: Your account does not have sufficient permissions to perform the requested action."

    // If all goes well, this shouldn't happen, 404s should be JSONs so the errors con be handled better at a higher level.
    case 404:
      return "Resource Not Found: The requested resource was not found."

    case 408:
      return "Request Timeout: The request took too long to process. Please try again."

    case 429:
      return "Too Many Requests: Wait a moment before making further requests and make them at a reduced rate."

    case 500:
      return "PagerDuty Server Error: An error occurred on PagerDuty's side while processing your request. Please try again."

    default:
      return "An unexpected PagerDuty API error occurred."
  }
}