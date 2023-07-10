import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { IContact, RequestMethod } from "./types";
import { Incident, PaginationIncident } from "../types/Incident";

export const getIncidentsById = async (
  client: IDeskproClient,
  ids: string[]
): Promise<Incident[]> => {
  return await Promise.all(ids.map((e) => getIncidentById(client, e)));
};

export const createComment = async (
  client: IDeskproClient,
  incidentId: string,
  comment: string
): Promise<Incident[]> => {
  return installedRequest(client, `incidents/${incidentId} `, "POST", {
    content: comment,
  });
};

export const getIncidentById = (
  client: IDeskproClient,
  id: string
): Promise<Incident> => {
  return installedRequest(client, `incidents/${id} `, "GET");
};

export const getIncidents = (
  client: IDeskproClient
): Promise<PaginationIncident> => {
  return installedRequest(client, `incidents `, "GET");
};

export const getTeams = (client: IDeskproClient): Promise<IContact> => {
  return installedRequest(client, `teams`, "GET");
};

const installedRequest = async (
  client: IDeskproClient,
  endpoint: string,
  method: RequestMethod,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token token=__api_key__",
      Accept: "application/vnd.pagerduty+json;version=2",
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

export const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;
