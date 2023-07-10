import {
  LoadingSpinner,
  Stack,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import IncidentJson from "../../mapping/incident.json";
import { useQueryWithClient } from "../../hooks/useQueryWithClient";
import { getIncidentById } from "../../api/api";
import { useParams } from "react-router-dom";

export const ViewIncident = () => {
  const { incidentId } = useParams();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("PagerDuty");

    client.registerElement("editButton", {
      type: "edit_button",
    });
  }, []);

  const incidentByIdQuery = useQueryWithClient(
    "getIncidentsById",
    (client) => getIncidentById(client, incidentId as string),
    {
      enabled: !!incidentId,
    }
  );

  const incident = incidentByIdQuery.data;

  if (!incident) return <LoadingSpinner />;

  return (
    <Stack>
      <FieldMapping
        fields={[incident]}
        metadata={IncidentJson.view}
        childTitleAccessor={(e) => e.title}
        idKey={IncidentJson.idKey}
        externalChildUrl={IncidentJson.externalUrl}
      />
    </Stack>
  );
};
