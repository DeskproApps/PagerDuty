import {
  LoadingSpinner,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { useQueryWithClient } from "../hooks/useQueryWithClient";
import { useEffect, useState } from "react";
import { useLinkIncidents, useTicketCount } from "../hooks/hooks";
import { getIncidentsById } from "../api/api";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import IncidentJson from "../mapping/incident.json";

export const Main = () => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const navigate = useNavigate();
  const [incidentIds, setIncidentIds] = useState<string[]>([]);
  const [incidentLinketCount, setIncidentLinkedCount] = useState<
    Record<string, number>
  >({});
  const { getLinkedIncidents } = useLinkIncidents();
  const { getMultipleIncidentTicketCount } = useTicketCount();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("PagerDuty");

    client.registerElement("homeButton", {
      type: "home_button",
    });

    client.deregisterElement("menuButton");

    client.registerElement("menuButton", {
      type: "menu",
      items: [
        {
          title: "Go to Link/Create Incident",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });

    client.deregisterElement("editButton");

    client.registerElement("refreshButton", {
      type: "refresh_button",
    });
  }, []);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "menuButton":
          navigate("/findOrCreate");
          break;

        case "homeButton":
          navigate("/redirect");
      }
    },
  });
  const incidentsByIdQuery = useQueryWithClient(
    "getIncidentsById",
    (client) => getIncidentsById(client, incidentIds),
    {
      enabled: !!incidentIds.length,
    }
  );

  useEffect(() => {
    (async () => {
      if (!context || !client) return;

      const linkedIncidents = await getLinkedIncidents();

      if (!linkedIncidents || linkedIncidents.length === 0) {
        navigate("/findOrCreate");

        return;
      }

      setIncidentIds(linkedIncidents as string[]);

      const incidentLinkedCount = await getMultipleIncidentTicketCount(
        linkedIncidents
      );

      setIncidentLinkedCount(incidentLinkedCount);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, client]);

  const incidents = incidentsByIdQuery.data;

  if (incidentsByIdQuery.isFetching || !incidents || !incidentLinketCount)
    return <LoadingSpinner />;

  return (
    <Stack vertical style={{ width: "100%" }}>
      <FieldMapping
        fields={incidents.map((e) => ({
          ...e.incident,
          linked_tickets: incidentLinketCount[e.incident.id],
        }))}
        metadata={IncidentJson.link}
        idKey={IncidentJson.idKey}
        internalChildUrl={`/view/incident/`}
        externalChildUrl={IncidentJson.externalUrl}
        childTitleAccessor={(e) => e.title}
      />
    </Stack>
  );
};
