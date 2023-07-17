import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useTicketCount = () => {
  const { client } = useDeskproAppClient();

  const getIncidentTicketCount = useCallback(
    async (incidentId: string) => {
      if (!client) return;

      return (await client.getState(`incident/${incidentId}`))?.[0]?.data as
        | number
        | undefined;
    },
    [client]
  );

  const getMultipleIncidentTicketCount = useCallback(
    async (incidentIds: string[]) => {
      if (!client) return {};

      const incidentObjArr = await Promise.all(
        incidentIds.map(async (id) => ({
          [id]: (await getIncidentTicketCount(id)) || 0,
        }))
      );

      return incidentObjArr.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    },
    [client, getIncidentTicketCount]
  );

  const incrementIncidentTicketCount = useCallback(
    async (incidentId: string) => {
      if (!client) return;

      return await client.setState(
        `incident/${incidentId}`,
        ((await getIncidentTicketCount(incidentId)) || 0) + 1
      );
    },
    [client, getIncidentTicketCount]
  );

  const decrementIncidentTicketCount = useCallback(
    async (incidentId: string) => {
      if (!client) return;

      return await client.setState(
        `incident/${incidentId}`,
        ((await getIncidentTicketCount(incidentId)) || 1) - 1
      );
    },
    [client, getIncidentTicketCount]
  );

  return {
    getIncidentTicketCount,
    incrementIncidentTicketCount,
    decrementIncidentTicketCount,
    getMultipleIncidentTicketCount,
  };
};

export const useLinkIncidents = () => {
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();

  const { incrementIncidentTicketCount, decrementIncidentTicketCount } =
    useTicketCount();

  const deskproUser = context?.data.user;

  const linkIncidents = useCallback(
    async (incidentsId: string[]) => {
      if (!context || !incidentsId.length || !client || !deskproUser) return;

      setIsLinking(true);

      await Promise.all(
        (incidentsId || []).map((id) =>
          client
            ?.getEntityAssociation("linkedIncidents", deskproUser?.id)
            .set(id)
        )
      );

      await Promise.all(
        incidentsId.map((id) => incrementIncidentTicketCount(id))
      );

      navigate("/");

      setIsLinking(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, client, deskproUser, incrementIncidentTicketCount]
  );

  const getLinkedIncidents = useCallback(async () => {
    if (!client || !deskproUser) return;

    return await client
      .getEntityAssociation("linkedIncidents", deskproUser?.id)
      .list();
  }, [client, deskproUser]);

  const unlinkIncident = useCallback(
    async (incidentId: string) => {
      if (!client || !deskproUser) return;

      await client
        .getEntityAssociation("linkedIncidents", deskproUser?.id)
        .delete(incidentId);

      await decrementIncidentTicketCount(incidentId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [client, decrementIncidentTicketCount, deskproUser]
  );
  return {
    linkIncidents,
    isLinking,
    getLinkedIncidents,
    unlinkIncident,
  };
};