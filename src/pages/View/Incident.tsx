import {
  LoadingSpinner,
  Stack,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import IncidentJson from "../../mapping/incident.json";
import { getIncidentById, getIncidentNotes } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useLinkIncidents } from "../../hooks/hooks";
import { Notes } from "../../components/Notes/Notes";

export const ViewIncident = () => {
  const { incidentId } = useParams();
  const { unlinkIncident } = useLinkIncidents();
  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("PagerDuty");

    client.registerElement("editButton", {
      type: "edit_button",
    });

    client.registerElement("homeButton", {
      type: "home_button",
    });

    client.deregisterElement("menuButton");

    client.registerElement("menuButton", {
      type: "menu",
      items: [
        {
          title: "Unlink Incident",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });
  }, []);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "menuButton":
          await unlinkIncident(incidentId as string);

          navigate("/redirect");

          break;

        case "editButton":
          navigate("/edit/incident/" + incidentId);

          break;

        case "homeButton":
          navigate("/redirect");
      }
    },
  });

  const incidentByIdQuery = useQueryWithClient(
    ["getIncidentById"],
    (client) => getIncidentById(client, incidentId as string),
    {
      enabled: !!incidentId,
    }
  );

  const incidentNotes = useQueryWithClient(
    ["iIncidentNotes"],
    (client) => getIncidentNotes(client, incidentId as string),
    {
      enabled: !!incidentId,
    }
  );

  const incident = incidentByIdQuery.data?.incident;

  const notes = incidentNotes.data?.notes;

  if (
    incidentByIdQuery.isFetching ||
    !incident ||
    incidentNotes.isFetching ||
    !notes
  )
    return <LoadingSpinner />;

  return (
    <Stack vertical gap={10}>
      <FieldMapping
        fields={[incident]}
        metadata={IncidentJson.view}
        childTitleAccessor={(e) => e.title}
        idKey={IncidentJson.idKey}
        externalChildUrl={IncidentJson.externalUrl}
      />
      <Notes id={incidentId as string} notes={notes}></Notes>
    </Stack>
  );
};
